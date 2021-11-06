import { AbstractCanvas } from './AbstractCanvas'
import { Coordinate } from '../coords/Coordinate'
import { PaintEvent } from '../events/PaintEvent'
import {
  clearCanvas,
  fillCanvas,
  paintKaraidGrid,
} from './strokeFuncs/canvasPaintFuncs'
import { Point } from '../coords/Point'
import { CanvasToolName } from './CanvasToolName'
import { normalizeAngle } from '../coords/CoordUtil'
import { CanvasHistory } from './CanvasHistory'
import { getStrokeEndPressure } from './strokeFuncs/getStrokePressure'
import { Pen } from './Pen'
import { StrokeStyle } from './StrokeStyle'
import { StrokeRecord } from './StrokeRecord'
import { replayPenStroke } from './strokeFuncs/replayStrokes'
import { cursorForTool } from '../events/cursorForTool'
import { useDragEvent } from '../events/useDragEvent'
import { PointsDist } from '../coords/PointsDist'
import { TouchTransform, useTouchTransform } from '../events/useTouchTransform'
import { getNextZoom } from '../events/zoomTable'
import { PointerSmoother } from '../events/PointerSmoother'

// Retina対応: 固定でx2
const RESOLUTION = 2 //window.devicePixelRatio

/** カーソル移動を検出する最低距離(px) */
const MIN_CURSOR_MOVE = 3.0

const PENKIND2COMPOSITION = {
  normal: '',
  eraser: 'destination-out',
}

type EventStatus = {
  /** ストローク用の一時キャンバスが有効か？ */
  isUseStrokeCanvas: boolean
  /** 現在のストロークで実行中の操作 */
  activeEvent: CanvasToolName | undefined
  /** 現在のストローク開始時の座標系（スクロールや回転で使用） */
  startCoord: Coordinate
  /** 現在のストローク開始時の座標 */
  startPoint: Point
  /** 現在のストローク開始時のアンカー */
  startAnchor: Coordinate
  /** 現在のストロークにおける直近の座標 */
  lastPoint: Point
  /** スタンプのキャプチャーモードか？ */
  isCapturing: boolean
  /** マルチタッチ操作中か？ */
  isInMultiTouch: boolean
}

export class PaintCanvas {
  private readonly width: number
  private readonly height: number

  /** 描画バッファCanvas */
  private readonly canvas: AbstractCanvas
  /** 描画中のストロークを保持するバッファCanvas */
  private readonly strokeCanvas: AbstractCanvas
  /** 表示用Canvas */
  private readonly view: AbstractCanvas
  /** 現在実行中のストロークイベントの状態 */
  private readonly eventStatus: EventStatus = {
    isUseStrokeCanvas: false,
    activeEvent: undefined,
    startCoord: new Coordinate(),
    startPoint: new Point(),
    startAnchor: new Coordinate(),
    lastPoint: new Point(),
    isCapturing: false,
    isInMultiTouch: false,
  }
  /** 履歴 */
  private readonly history: CanvasHistory

  // 変更通知イベント
  private readonly requestChangeZoom = new PaintEvent<number>()
  private readonly requestScrollTo = new PaintEvent<Point>()
  private readonly requestRotateTo = new PaintEvent<number>()
  private readonly requestUndo = new PaintEvent<void>()
  private readonly requestAnchorMoveTo = new PaintEvent<Point>()
  private readonly requestAnchorRotateTo = new PaintEvent<number>()
  private readonly requestAnchorReset = new PaintEvent<void>()

  private readonly pen: Pen = new Pen()
  private style: StrokeStyle = new StrokeStyle()
  private stamp?: StrokeRecord
  private _tool: CanvasToolName = 'draw'
  private _isKaleido = false
  private _backgroundColor = '#ffffff'

  private readonly smoother = new PointerSmoother()

  /**
   * キャンバスを生成します
   * @param parent キャンバス挿入先
   */
  constructor(parent: HTMLElement, width: number, height: number) {
    this.width = width
    this.height = height
    // 描画先・表示先を生成
    this.canvas = new AbstractCanvas(
      this.width * RESOLUTION,
      this.height * RESOLUTION
    )
    this.strokeCanvas = new AbstractCanvas(
      this.width * RESOLUTION,
      this.height * RESOLUTION
    )
    this.view = new AbstractCanvas(
      this.width * RESOLUTION,
      this.height * RESOLUTION
    )
    this.history = new CanvasHistory(
      this.width * RESOLUTION,
      this.height * RESOLUTION
    )

    // canvas要素をDOMに挿入
    this.view.el.style.width = `${width}px`
    this.view.el.style.height = `${height}px`
    parent.appendChild(this.view.el)

    // デバッグ用に表示
    const debugBox = document.getElementById('debug')
    if (debugBox) {
      const debugScale = 200 / Math.max(width, height)
      this.canvas.el.style.width = `${width * debugScale}px`
      this.canvas.el.style.height = `${height * debugScale}px`
      this.strokeCanvas.el.style.width = `${width * debugScale}px`
      this.strokeCanvas.el.style.height = `${height * debugScale}px`
      debugBox.querySelector('.canvas')?.appendChild(this.canvas.el)
      debugBox.querySelector('.stroke')?.appendChild(this.strokeCanvas.el)
    }

    // マルチタッチでのキャンバス操作を初期化
    useTouchTransform(
      this.view.el,
      {
        onStart: () => {
          this.endStroke(false)
          this.eventStatus.isInMultiTouch = true
        },
        onTransform: (tr, count) =>
          count >= 3
            ? this.onTouchTramsformAnchor(tr)
            : this.onTouchTramsformCanvas(tr),
        onEnd: () => {
          this.eventStatus.isInMultiTouch = false
        },
        onTwoFingerTap: () => this.requestUndo.fire(),
        onThreeFingerTap: () => this.requestAnchorReset.fire(),
      },
      MIN_CURSOR_MOVE
    )

    // キャンバス上のマウスイベントを初期化
    useDragEvent(
      this.view.el,
      (ev) => !this.eventStatus.isInMultiTouch && this.onDown(ev),
      (ev, dist) => !this.eventStatus.isInMultiTouch && this.onDrag(ev, dist),
      (ev, dist) => !this.eventStatus.isInMultiTouch && this.onUp(ev, dist),
      MIN_CURSOR_MOVE
    )

    this.tool = 'draw'
    this.clear(false)
  }

  get coord() {
    return this.canvas.coord
  }

  set coord(c: Coordinate) {
    // anchor(回転軸)のみ画面中央に調整してセット
    this.canvas.coord = c.clone({})
    this.rePaint()
  }

  get tool() {
    return this._tool
  }

  set tool(v) {
    this._tool = v
    this.view.el.style.cursor = cursorForTool(v)
  }

  get isKaleido() {
    return this._isKaleido
  }

  set isKaleido(v) {
    if (v === this._isKaleido) return
    this._isKaleido = v
    const c = this.penCount
    this.penCount = 1
    this.penCount = c
    this.rePaint()
  }

  get penCount() {
    return this.pen.childCount
  }
  set penCount(n: number) {
    if (n === this.penCount) return
    const pen = this.pen
    // 子ペンを一度クリアして再設定
    pen.clearChildren()
    for (let penNo = 0; penNo < n; penNo++) {
      const isFlip = this._isKaleido && penNo % 2 !== 0
      pen.addChildPen(
        new Coordinate({ angle: (penNo * 360) / n, flipY: isFlip })
      )
    }
    this.rePaint()
  }

  set penWidth(v: number) {
    this.style = this.style.clone({ penSize: v })
  }

  set penColor(v: string) {
    this.style = this.style.clone({ color: v })
  }

  set penAlpha(v: number) {
    this.style = this.style.clone({ alpha: v })
  }

  get penKind(): 'normal' | 'eraser' {
    const comp = this.style.composition
    return comp === '' ? 'normal' : 'eraser'
  }

  set penKind(v: 'normal' | 'eraser') {
    this.style = this.style.clone({ composition: PENKIND2COMPOSITION[v] })
  }

  get hasStamp() {
    return !!this.stamp
  }

  get backgroundColor() {
    return this._backgroundColor
  }

  set backgroundColor(v) {
    if (this._backgroundColor === v) return
    this._backgroundColor = v
    this.rePaint()
  }

  get anchor(): Coordinate {
    return this.pen.anchor
  }

  set anchor(v: Coordinate) {
    this.pen.anchor = v
    this.rePaint()
  }

  /** ズーム変更操作発生時のリスナーを登録します。ズームを行うにはリスナー側で座標系(coord.scale)を変更します */
  listenRequestZoom(...params: Parameters<PaintEvent<number>['listen']>) {
    this.requestChangeZoom.listen(...params)
  }
  /** スクロール操作発生時のリスナーを登録します。スクロールを行うにはリスナー側で座標系(coord.scroll)を変更します */
  listenRequestScrollTo(...params: Parameters<PaintEvent<Point>['listen']>) {
    this.requestScrollTo.listen(...params)
  }
  /** 回転操作発生時のリスナーを登録します。回転を行うにはリスナー側で座標系(coord.angle)を変更します */
  listenRequestRotateTo(...params: Parameters<PaintEvent<number>['listen']>) {
    this.requestRotateTo.listen(...params)
  }
  /** Undo操作発生時のリスナーを登録します。Undoを行うにはリスナー側でundoメソッドを呼び出します */
  listenRequestUndo(...params: Parameters<PaintEvent<void>['listen']>) {
    this.requestUndo.listen(...params)
  }
  /** アンカー移動操作発生時のリスナーを登録します。アンカー移動を行うにはリスナー側でanchorプロパティを変更します */
  listenRequestAnchorMoveTo(
    ...params: Parameters<PaintEvent<Point>['listen']>
  ) {
    this.requestAnchorMoveTo.listen(...params)
  }
  /** アンカー回転操作発生時のリスナーを登録します。アンカー回転を行うにはリスナー側でanchorプロパティを変更します */
  listenRequestAnchorRotateTo(
    ...params: Parameters<PaintEvent<number>['listen']>
  ) {
    this.requestAnchorRotateTo.listen(...params)
  }
  /** アンカーリセット操作発生時のリスナーを登録します。アンカーリセットを行うにはリスナー側でanchorプロパティを変更します */
  listenRequestAnchorReset(
    ...params: Parameters<PaintEvent<void>['listen']>
  ) {
    this.requestAnchorReset.listen(...params)
  }
  /** キャンバスをクリアします */
  clear(isSaveHistory = true) {
    if (isSaveHistory) {
      this.history.start(this.coord, this.pen.state, this.style, 'clearAll')
      this.history.commit(this.canvas)
    }
    clearCanvas(this.canvas)
    this.rePaint()
  }

  /** 最後のストロークを取り消します */
  undo() {
    if (!this.history.undoable) return
    this.clear(false)
    this.history.undo(this.canvas, this.strokeCanvas)
    this.rePaint()
  }

  async toImgBlob() {
    return new Promise<Blob>((resolve, reject) => {
      this.canvas.el.toBlob((blob) => (blob ? resolve(blob) : reject()))
    })
  }

  private event2canvasPoint(ev: PointerEvent): Point {
    return new Point(
      (ev.offsetX - this.width / 2) * RESOLUTION,
      (ev.offsetY - this.height / 2) * RESOLUTION
    )
  }

  private onDown(ev: PointerEvent): boolean {
    const action = this.tool
    this.eventStatus.activeEvent = action
    this.eventStatus.startCoord = this.coord
    this.eventStatus.startAnchor = this.anchor
    this.eventStatus.lastPoint = this.eventStatus.startPoint =
      this.event2canvasPoint(ev)
    this.eventStatus.isCapturing = ev.metaKey
    this.smoother.clear()

    if (action === 'zoomup' || action === 'zoomdown') {
      const scale = this.coord.scale
      if (action === 'zoomup')
        this.requestChangeZoom.fire(getNextZoom(scale, true))
      if (action === 'zoomdown')
        this.requestChangeZoom.fire(getNextZoom(scale, false))
      return false
    }

    if (
      action === 'draw' ||
      action === 'draw:line' ||
      action === 'draw:stamp'
    ) {
      this.startStroke(this.eventStatus.startPoint)
    }

    return true
  }

  private onDrag(ev: PointerEvent, dist: PointsDist) {
    const action = this.eventStatus.activeEvent
    const canvasP = this.event2canvasPoint(ev)
    const smoothedInp = this.smoother.add({
      point: canvasP,
      pressure: ev.pressure,
    })
    if (action === 'draw') {
      this.continueStroke(smoothedInp.point, smoothedInp.pressure || 0.5)
      this.eventStatus.lastPoint = smoothedInp.point
    }
    if (action === 'draw:line') {
      clearCanvas(this.strokeCanvas)
      this.continueStroke(smoothedInp.point, smoothedInp.pressure || 0.5)
    }
    if (action === 'draw:stamp' && this.stamp) {
      clearCanvas(this.strokeCanvas)
      const dp = smoothedInp.point.sub(this.eventStatus.startPoint)
      const stampScale = dp.length / 100
      this.putStroke(
        this.stamp,
        this.eventStatus.startPoint,
        stampScale,
        dp.angle,
        true
      )
    }
    if (action === 'scroll') {
      this.onScroll(dist)
    }
    if (action === 'rotate') {
      this.onRotate(dist)
    }

    ev.preventDefault()
  }

  private onUp(ev: PointerEvent, dist: PointsDist) {
    const action = this.eventStatus.activeEvent
    const canvasP = this.event2canvasPoint(ev)
    const hasPaint =
      action === 'draw' || action === 'draw:line' || action === 'draw:stamp'
    if (action === 'draw') {
      this.continueStroke(canvasP, ev.pressure || 0)
    }
    if (action === 'draw:line') {
      clearCanvas(this.strokeCanvas)
      this.continueStroke(
        canvasP,
        this.history.current
          ? getStrokeEndPressure(this.history.current.inputs)
          : 0.5
      )
      this.history.current?.clearPoints(true, true) // ストローク履歴の中間を捨てる
    }
    if (action === 'draw:stamp' && this.stamp) {
      clearCanvas(this.strokeCanvas)
      const dp = canvasP.sub(this.eventStatus.startPoint)
      const stampScale = dp.length / 100
      this.putStroke(
        this.stamp,
        this.eventStatus.startPoint,
        stampScale,
        dp.angle,
        false
      )
    }

    if (
      (action === 'draw' || action === 'draw:line') &&
      this.eventStatus.isCapturing
    ) {
      this.stamp = this.history.current?.flatten
      this.endStroke(false)
      this.rePaint()
      return
    }

    if (action === 'scroll') {
      this.onScroll(dist)
    }
    if (action === 'rotate') {
      this.onRotate(dist)
    }

    this.endStroke(hasPaint)
  }

  /**
   * ストロークを開始します。
   * 一時キャンバスを有効にし、新規ストロークの記録を開始します。
   */
  private startStroke(p: Point) {
    // 一時キャンバスを有効にしてに座標系を同期
    this.eventStatus.isUseStrokeCanvas = true
    this.strokeCanvas.coord = this.canvas.coord
    this.strokeCanvas.ctx.lineWidth =
      this.style.penSize * this.canvas.coord.scale

    const penColor = () => {
      if (this.eventStatus.isCapturing) return '#0044aa'
      if (this.penKind === 'eraser') return this.backgroundColor
      return this.style.color
    }
    this.strokeCanvas.ctx.strokeStyle = penColor()

    // ストロークの記録を開始
    this.history.start(this.coord, this.pen.state, this.style)
    this.history.current?.addPoint(p, 0.5)
  }

  /**
   * 現在のストロークに座標を入力してストロークを継続します。
   * スクロークは一時キャンバスを経由して描画されます。
   * 履歴に座標を追加します。
   */
  private continueStroke(p: Point, pressure = 0.5) {
    this.history.current?.addPoint(p, pressure)
    this.pen.drawTo(this.strokeCanvas, this.eventStatus.lastPoint, p, pressure)
    this.rePaint()
  }

  /**
   * 現在のストロークを終了します。
   * @param commitStroke ストロークを確定するか？確定しない場合、現在のストロークは破棄されます。
   */
  private endStroke(commitStroke: boolean) {
    if (commitStroke) {
      this.history.commit(this.canvas)
      // 一時キャンバスの内容をキャンバスに転送
      this.strokeCanvas.copy(this.canvas.ctx, {
        alpha: this.style.alpha,
        composition: this.style.composition,
      })
      clearCanvas(this.strokeCanvas)
    } else {
      this.history.rollback()
      clearCanvas(this.strokeCanvas)
    }
    this.eventStatus.isUseStrokeCanvas = false
    this.eventStatus.activeEvent = undefined
    this.rePaint()
  }

  private onScroll(dist: PointsDist) {
    const scroll = this.eventStatus.startCoord.scroll.move(
      dist.distance
        .scale((-1 / this.coord.scale) * RESOLUTION)
        .rotate(-this.coord.angle)
    )
    this.requestScrollTo.fire(scroll)
  }

  private onRotate(dist: PointsDist) {
    const angle = this.eventStatus.startCoord.angle + dist.angle
    this.requestRotateTo.fire(normalizeAngle(angle))
  }

  private onTouchTramsformCanvas(transform: TouchTransform) {
    const startCoord = this.eventStatus.startCoord
    const {center, scroll, scale, angle} = transform

    // viewキャンバスの座標を実キャンバスの座標系に変換します
    const view2canvasPos = (vp: Point): Point => {
      const cp = vp
        .rotate(-startCoord.angle)
        .move(startCoord.scroll)
        .scale(1 / startCoord.scale)
      return cp
    }
    // viewキャンバスの距離（移動量）を実キャンバスの座標系に変換します
    const view2canvasDist = (vp: Point): Point => {
      const cp = vp.rotate(-startCoord.angle).scale(1 / startCoord.scale)
      return cp
    }

    // タッチ中心 @ viewキャンバス座標系
    const posView = new Point(
      (center.x - this.width / 2) * RESOLUTION,
      (center.y - this.height / 2) * RESOLUTION
    )
    // タッチ中心 @ 実キャンバス座標系
    const posCanvas = view2canvasPos(posView)

    // 画面中心 @ viewキャンバス座標系
    const viewCenter = new Point(0, 0)

    // 画面中心 @ 実キャンバス座標系
    const viewCenterAtCanvas = view2canvasPos(viewCenter)

    // タッチ中心 - 画面中心 @ 実キャンバス座標系
    const posCanvasFromCenter = posCanvas.sub(viewCenterAtCanvas)
    
    // タッチ操作（回転・スケール）での移動量 @ 実キャンバス座標系
    const posMoved = posCanvasFromCenter.rotate(-angle).scale(1 / scale)
    const posSub = posMoved.sub(posCanvasFromCenter)
    
    // タッチ操作スクロール量 @ viewキャンバス座標系
    const viewScroll = scroll.scale(RESOLUTION)
    // タッチ操作スクロール量 @ 実キャンバス座標系
    const canvasScroll = view2canvasDist(viewScroll)

    this.requestRotateTo.fire(startCoord.angle + angle)
    this.requestChangeZoom.fire(startCoord.scale * scale)
    this.requestScrollTo.fire(startCoord.scroll.sub(posSub).sub(canvasScroll))
  }
  private onTouchTramsformAnchor(transform: TouchTransform) {
    const angle = transform.angle + this.eventStatus.startAnchor.angle
    const scroll = transform.scroll
      .scale((1 / this.eventStatus.startCoord.scale) * RESOLUTION)
      .rotate(-this.eventStatus.startCoord.angle)
      .move(this.eventStatus.startAnchor.scroll)

    this.requestAnchorMoveTo.fire(scroll)
    this.requestAnchorRotateTo.fire(angle)
  }

  /**
   * 記録したストロークを現在のペンで描画します。
   * @param rec 配置するストローク
   * @param p 配置座標
   * @param scale スケール
   * @param angle 角度
   * @param isPreview プレビューモードで描画するか？プレビューモードを使用すると高速に描画できる代わりに筆圧固定になります
   */
  private putStroke(
    rec: StrokeRecord,
    p: Point,
    scale: number,
    angle: number,
    isPreview: boolean
  ) {
    const pen = new Pen()
    pen.state = this.pen.state

    const previewStyle = this.style.clone({
      color:
        this.penKind === 'eraser' ? this.backgroundColor : this.style.color,
    })

    const canvasP = p
    const stampRec = new StrokeRecord(
      this.coord,
      pen.state,
      isPreview ? previewStyle : this.style,
      rec.tool
    )
    const movedInps = rec.inputs.map((inp) => ({
      point: inp.point.scale(scale).rotate(angle).move(canvasP),
      pressure: inp.pressure,
    }))
    stampRec.inputs.push(...movedInps)
    replayPenStroke(this.strokeCanvas, stampRec, isPreview)
    this.rePaint()

    const currentHist = this.history.current
    if (!isPreview && currentHist) {
      currentHist.clearPoints()
      currentHist.inputs.push(...stampRec.inputs)
    }
  }

  private rePaint() {
    fillCanvas(this.view, '#cccccc')
    this.canvas.output(this.view.ctx, { background: this.backgroundColor })
    if (this.eventStatus.isUseStrokeCanvas) {
      this.strokeCanvas.output(this.view.ctx, { alpha: this.style.alpha })
    }
    if (this.penCount >= 2) {
      paintKaraidGrid(
        this.view,
        this.penCount,
        this.isKaleido,
        new Coordinate({
          scroll: this.coord.scroll.invert
            .move(this.pen.anchor.scroll)
            .scale(this.canvas.coord.scale)
            .rotate(this.coord.angle),
          angle: this.coord.angle + this.pen.anchor.angle,
        })
      )
    }
  }
}
