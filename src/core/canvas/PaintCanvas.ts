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
import { isSameArray } from '../misc/ArrayUtil'

// Retina対応: 固定でx2
const RESOLUTION = 2 //window.devicePixelRatio

/** カーソル移動を検出する最低距離(px) */
const MIN_CURSOR_MOVE = 3.5

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
  /** 現在のストローク開始時のアンカー[root, child] */
  startAnchor: [Coordinate, Coordinate]
  /** 現在のストローク開始時の座標 */
  startPoint: Point
  /** 現在のストロークにおける直近の座標 */
  lastPoint: Point
  /** スタンプのキャプチャーモードか？ */
  isCapturing: boolean
  /** マルチタッチ操作中か？ */
  isInMultiTouch: boolean
}

/** 移動の対象 */
type TransformScrollTarget = 'canvas' | 'anchor'
/** 回転の対象 */
type TransformRotateTarget = TransformScrollTarget

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
    startAnchor: [new Coordinate(), new Coordinate()],
    startPoint: new Point(),
    lastPoint: new Point(),
    isCapturing: false,
    isInMultiTouch: false,
  }
  /** 履歴 */
  private readonly history: CanvasHistory

  // 変更通知イベント
  private readonly requestChangeZoom = new PaintEvent<number>()
  private readonly requestScrollTo = new PaintEvent<{
    point: Point
    target: TransformScrollTarget
  }>()
  private readonly requestRotateTo = new PaintEvent<{
    angle: number
    target: TransformRotateTarget
  }>()
  private readonly requestUndo = new PaintEvent<void>()
  private readonly requestAnchorTransform = new PaintEvent<Coordinate>()
  private readonly requestAnchorReset = new PaintEvent<void>()

  private readonly pen: Pen = new Pen()
  private style: StrokeStyle = new StrokeStyle()
  private stamp?: StrokeRecord
  private _tool: CanvasToolName = 'draw'
  private _backgroundColor = '#ffffff'
  private _anchor = new Coordinate()
  private _anchorChild = new Coordinate()
  private _penCount: [number, number] = [1, 0]
  private _isKaleido: [boolean, boolean] = [false, false]
  //private readonly smoother = new PointerSmoother()

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
      () => (this.tool === 'scroll:anchor' || this.tool === 'rotate:anchor') ? this.canvas2displayPos(this.activeAnchor.scroll, 'start') : undefined,
      MIN_CURSOR_MOVE
    )

    //this.anchor = new Coordinate({angle: 30})
    this.childAnchor = new Coordinate({ scroll: new Point(300, 0), angle: 0 })
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

  get isKaleido(): [boolean, boolean] {
    return [...this._isKaleido]
  }

  set isKaleido(v) {
    if (isSameArray(this.isKaleido, v)) return
    this._isKaleido = [...v]
    this.rebuildPen()
    this.rePaint()
  }

  get penCount(): [number, number] {
    return this._penCount
  }
  set penCount(count) {
    if (isSameArray(this.penCount, count)) return
    this._penCount = [...count]
    this.rebuildPen()
    this.rePaint()
  }

  get hasSubPen() {
    return this.penCount[1] >= 1
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
    return this._anchor
  }

  set anchor(v: Coordinate) {
    this._anchor = v
    this.rebuildPen()
    this.rePaint()
  }

  get childAnchor(): Coordinate {
    return this._anchorChild
  }

  set childAnchor(v) {
    this._anchorChild = v
    this.rebuildPen()
    this.rePaint()
  }

  get activeAnchor(): Coordinate {
    return this.hasSubPen ? this.childAnchor : this.anchor
  }

  set activeAnchor(v) {
    this[this.hasSubPen ? 'childAnchor' : 'anchor'] = v
  }

  private get relativeChildAnchor(): Coordinate {
    return new Coordinate({
      scroll: this.childAnchor.scroll
        .sub(this.anchor.scroll)
        .rotate(-this.anchor.angle),
      angle: this.childAnchor.angle,
    })
  }

  private rebuildPen() {
    const root = this.pen
    const [pKaleido, cKaleido] = this.isKaleido
    const [pCount, cCount] = [
      this.penCount[0] * (pKaleido ? 2 : 1),
      this.penCount[1] * (cKaleido ? 2 : 1),
    ]
    const relativeAnchor = this.relativeChildAnchor

    // 子ペンを一度クリアして再設定
    root.clearChildren()
    root.coord = this._anchor
    for (let penNo = 0; penNo < pCount; penNo++) {
      const isFlip = this._isKaleido[0] && penNo % 2 !== 0
      const child = root.addChildPen(
        new Coordinate({ angle: (penNo / pCount) * 360, flipY: isFlip })
      )
      for (let penNoCh = 0; penNoCh < cCount; penNoCh++) {
        const isFlipCh = this._isKaleido[1] && penNoCh % 2 !== 0
        child
          .addChildPen(
            new Coordinate({
              scroll: relativeAnchor.scroll,
              angle: relativeAnchor.angle,
            })
          )
          .addChildPen(
            new Coordinate({
              angle: (penNoCh / cCount) * 360,
              flipY: isFlipCh,
            })
          )
      }
    }
  }

  /** ズーム変更操作発生時のリスナーを登録します。ズームを行うにはリスナー側で座標系(coord.scale)を変更します */
  listenRequestZoom(...params: Parameters<PaintEvent<number>['listen']>) {
    this.requestChangeZoom.listen(...params)
  }
  /** スクロール操作発生時のリスナーを登録します。スクロールを行うにはリスナー側で座標系(coord.scroll)を変更します */
  listenRequestScrollTo(
    ...params: Parameters<
      PaintEvent<{ point: Point; target: TransformScrollTarget }>['listen']
    >
  ) {
    this.requestScrollTo.listen(...params)
  }
  /** 回転操作発生時のリスナーを登録します。回転を行うにはリスナー側で座標系(coord.angle)を変更します */
  listenRequestRotateTo(
    ...params: Parameters<
      PaintEvent<{ angle: number; target: TransformRotateTarget }>['listen']
    >
  ) {
    this.requestRotateTo.listen(...params)
  }
  /** Undo操作発生時のリスナーを登録します。Undoを行うにはリスナー側でundoメソッドを呼び出します */
  listenRequestUndo(...params: Parameters<PaintEvent<void>['listen']>) {
    this.requestUndo.listen(...params)
  }
  /** アンカー移動/回転操作発生時のリスナーを登録します。アンカー移動を行うにはリスナー側でanchorプロパティを変更します */
  listenRequestAnchorTransform(
    ...params: Parameters<
      PaintEvent<Coordinate>['listen']
    >
  ) {
    this.requestAnchorTransform.listen(...params)
  }
  /** アンカーリセット操作発生時のリスナーを登録します。アンカーリセットを行うにはリスナー側でanchorプロパティを変更します */
  listenRequestAnchorReset(...params: Parameters<PaintEvent<void>['listen']>) {
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

  private event2viewPoint(ev: PointerEvent): Point {
    return new Point(
      (ev.offsetX - this.width / 2) * RESOLUTION,
      (ev.offsetY - this.height / 2) * RESOLUTION
    )
  }

  private onDown(ev: PointerEvent): boolean {
    const action = this.tool
    this.eventStatus.activeEvent = action
    this.eventStatus.startCoord = this.coord
    this.eventStatus.startAnchor = [this.anchor, this.childAnchor]
    this.eventStatus.lastPoint = this.eventStatus.startPoint =
      this.event2viewPoint(ev)
    this.eventStatus.isCapturing = ev.metaKey
    
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
    const viewP = this.event2viewPoint(ev)
    const inp = {
      point: viewP,
      pressure: ev.pressure,
    }
    if (action === 'draw' || action === 'draw:line') {
      this.continueStroke(inp.point, inp.pressure || 0.5)
      this.eventStatus.lastPoint = inp.point
    }
    if (action === 'draw:stamp' && this.stamp) {
      const dp = inp.point.sub(this.eventStatus.startPoint)
      const stampScale = dp.length / 100
      this.putStroke(
        this.stamp,
        this.eventStatus.startPoint,
        stampScale,
        dp.angle,
        true
      )
    }
    if (action === 'scroll') this.onScroll(dist, 'canvas')
    if (action === 'scroll:anchor') this.onScroll(dist, 'anchor')
    if (action === 'rotate') this.onRotate(dist, 'canvas')
    if (action === 'rotate:anchor') this.onRotate(dist, 'anchor')

    ev.preventDefault()
  }

  private onUp(ev: PointerEvent, dist: PointsDist) {
    const action = this.eventStatus.activeEvent
    const canvasP = this.event2viewPoint(ev)
    const hasPaint =
      action === 'draw' || action === 'draw:line' || action === 'draw:stamp'
    if (action === 'draw') {
      this.continueStroke(canvasP, ev.pressure || 0)
    }
    if (action === 'draw:line') {
      clearCanvas(this.strokeCanvas)
      const current = this.history.current
      const pressure = this.history.current
      ? getStrokeEndPressure(this.history.current.inputs)
      : 0.5
      this.continueStroke(canvasP,pressure)
      if (current) {
        current.inputs.length = 1
        current.inputs[0].pressure = pressure
        const last = {point: canvasP,pressure}
        current.inputs.push(last, last)
      }
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

    if (action === 'scroll') this.onScroll(dist, 'canvas')
    if (action === 'scroll:anchor') this.onScroll(dist, 'anchor')
    if (action === 'rotate') this.onRotate(dist, 'canvas')
    if (action === 'rotate:anchor') this.onRotate(dist, 'anchor')

    this.endStroke(hasPaint)
  }

  view2canvasPos = (vp: Point, coordType: 'start' | 'current'): Point => {
    const coord =
      coordType === 'start' ? this.eventStatus.startCoord : this.coord
    const cp = vp
      .scale(1 / coord.scale)
      .rotate(-coord.angle)
      .move(coord.scroll)
    return cp
  }
  canvas2viewPos = (cp: Point, coordType: 'start' | 'current'): Point => {
    const coord =
      coordType === 'start' ? this.eventStatus.startCoord : this.coord
    const vp = cp
      .move(coord.scroll.invert)
      .rotate(coord.angle)
      .scale(coord.scale)
    return vp
  }
  canvas2displayPos = (cp: Point, coordType: 'start' | 'current'): Point => {
    return this.canvas2viewPos(cp, coordType)
      .move(new Point(this.width, this.height))
      .scale(1 / RESOLUTION)
  }

  /**
   * ストロークを開始します。
   * 一時キャンバスを有効にし、新規ストロークの記録を開始します。
   */
  private startStroke(viewPoint: Point) {
    const canvasPoint = this.view2canvasPos(viewPoint, 'start')
    // 一時キャンバスを有効にしてに座標系を同期
    this.eventStatus.isUseStrokeCanvas = true
    this.strokeCanvas.coord = new Coordinate() //this.canvas.coord
    this.strokeCanvas.ctx.lineWidth = this.style.penSize

    const penColor = () => {
      if (this.eventStatus.isCapturing) return '#0044aa'
      if (this.penKind === 'eraser') return this.backgroundColor
      return this.style.color
    }
    this.strokeCanvas.ctx.fillStyle = penColor()

    // ストロークの記録を開始
    this.history.start(this.coord, this.pen.state, this.style)
    this.history.current?.addPoint(canvasPoint, 0)
  }

  /**
   * 現在のストロークに座標を入力してストロークを継続します。
   * スクロークは一時キャンバスを経由して描画されます。
   * 履歴に座標を追加します。
   */
  private continueStroke(viewPoint: Point, pressure = 0.5) {
    const action = this.eventStatus.activeEvent
    const canvasPoint = this.view2canvasPos(viewPoint, 'start')
    const stroke = this.history.current
    if (!stroke) return
    stroke.addPoint(canvasPoint, pressure)
    clearCanvas(this.strokeCanvas)
    if (action === 'draw:line') {
      const start = {point: stroke.inputs[0].point, pressure}
      const last = stroke.inputs[stroke.inputs.length - 1]
      const inps = [start, last, last]
      this.pen.drawStrokes(this.strokeCanvas, [inps])
    } else {
      this.pen.drawStrokes(this.strokeCanvas, [stroke.inputs])
    }
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

  private onScroll(dist: PointsDist, target: TransformScrollTarget) {
    const anchorIndex = this.hasSubPen ? 1 : 0
    const targetCoord = {
      canvas: this.eventStatus.startCoord,
      anchor: this.eventStatus.startAnchor[anchorIndex],
    }[target]
    const scroll = targetCoord.scroll.move(
      dist.distance
        .scale((-1 / this.coord.scale) * RESOLUTION)
        .rotate(-this.coord.angle)
        .scale(target === 'anchor' ? -1 : 1)
    )
    this.requestScrollTo.fire({ point: scroll, target })
  }

  private onRotate(dist: PointsDist, target: TransformRotateTarget) {
    const anchorIndex = this.hasSubPen ? 1 : 0
    const targetCoord = {
      canvas: this.eventStatus.startCoord,
      anchor: this.eventStatus.startAnchor[anchorIndex],
    }[target]
    const angle = targetCoord.angle + dist.angle
    this.requestRotateTo.fire({ angle: normalizeAngle(angle), target })
  }

  private onTouchTramsformCanvas(transform: TouchTransform) {
    const startCoord = this.eventStatus.startCoord
    const { center, scroll, scale, angle } = transform

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
    const posCanvas = this.view2canvasPos(posView, 'start')

    // 画面中心 @ viewキャンバス座標系
    const viewCenter = new Point(0, 0)

    // 画面中心 @ 実キャンバス座標系
    const viewCenterAtCanvas = this.view2canvasPos(viewCenter, 'start')

    // タッチ中心 - 画面中心 @ 実キャンバス座標系
    const posCanvasFromCenter = posCanvas.sub(viewCenterAtCanvas)

    // タッチ操作（回転・スケール）での移動量 @ 実キャンバス座標系
    const posMoved = posCanvasFromCenter.rotate(-angle).scale(1 / scale)
    const posSub = posMoved.sub(posCanvasFromCenter)

    // タッチ操作スクロール量 @ viewキャンバス座標系
    const viewScroll = scroll.scale(RESOLUTION)
    // タッチ操作スクロール量 @ 実キャンバス座標系
    const canvasScroll = view2canvasDist(viewScroll)

    this.requestRotateTo.fire({
      angle: startCoord.angle + angle,
      target: 'canvas',
    })
    this.requestChangeZoom.fire(startCoord.scale * scale)
    this.requestScrollTo.fire({
      point: startCoord.scroll.sub(posSub).sub(canvasScroll),
      target: 'canvas',
    })
  }

  private onTouchTramsformAnchor(transform: TouchTransform) {
    const targetAnchor = this.eventStatus.startAnchor[this.hasSubPen ? 1 : 0]

    const angle = transform.angle + targetAnchor.angle
    const scroll = transform.scroll
      .scale((1 / this.eventStatus.startCoord.scale) * RESOLUTION)
      .rotate(-this.eventStatus.startCoord.angle)
      .move(targetAnchor.scroll)

    this.requestAnchorTransform.fire(targetAnchor.clone({ scroll, angle }))
    //this.requestAnchorRotateTo.fire(angle)
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
    replayPenStroke(this.strokeCanvas, stampRec)
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
      this.strokeCanvas.ctx.save()
      this.strokeCanvas.coord = this.canvas.coord
      this.strokeCanvas.output(this.view.ctx, { alpha: this.style.alpha })
      this.strokeCanvas.ctx.restore()
    }

    const [countParent, countChild] = this.penCount
    const [hasParentGrid, hasChildGrid] = [countParent >= 2, countChild >= 2]
    if (hasParentGrid) {
      // root coord
      paintKaraidGrid(
        this.view,
        countParent * (this.isKaleido[0] ? 2 : 1),
        this.isKaleido[0],
        new Coordinate({
          scroll: this.coord.scroll.invert
            .move(this.anchor.scroll)
            .scale(this.canvas.coord.scale)
            .rotate(this.coord.angle),
          angle: this.coord.angle + this.anchor.angle,
        }),
        hasChildGrid ? '#cccccc' : undefined
      )
    }
    if (hasChildGrid) {
      // child coord
      paintKaraidGrid(
        this.view,
        countChild * (this.isKaleido[1] ? 2 : 1),
        this.isKaleido[1],
        new Coordinate({
          scroll: this.coord.scroll.invert
            .move(this.childAnchor.scroll)
            .scale(this.canvas.coord.scale)
            .rotate(this.coord.angle),
          angle: this.coord.angle + this.anchor.angle + this.childAnchor.angle,
        }),
        '#eeaabb'
      )
    }
  }
}
