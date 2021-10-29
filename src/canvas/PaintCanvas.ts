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

// Retina対応: 固定でx2
const RESOLUTION = 2 //window.devicePixelRatio

/** カーソル移動を検出する最低距離(px) */
const MIN_CURSOR_MOVE = 3.0

type EventStatus = {
  /** ストローク用の一時キャンバスが有効か？ */
  isUseStrokeCanvas: boolean
  /** 現在のストロークで実行中の操作 */
  activeEvent: CanvasToolName | undefined
  /** 現在のストローク開始時の座標系（スクロールや回転で使用） */
  startCoord: Coordinate
  /** 現在のストローク開始時の座標 */
  startPoint: Point
  /** スタンプのキャプチャーモードか？ */
  isCapturing: boolean
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
    isCapturing: false,
  }
  /** 履歴 */
  private readonly history: CanvasHistory

  // 変更通知イベント
  private readonly requestChangeZoom = new PaintEvent<boolean>()
  private readonly requestScrollTo = new PaintEvent<Point>()
  private readonly requestRotateTo = new PaintEvent<number>()

  private readonly pen: Pen
  private style: StrokeStyle = new StrokeStyle()
  private stamp?: StrokeRecord
  private _tool: CanvasToolName = 'draw'
  private _isKaleido = false
  private _backgroundColor: string = '#ffffff'

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
      this.canvas.el.style.width = width * debugScale + 'px'
      this.canvas.el.style.height = height * debugScale + 'px'
      this.strokeCanvas.el.style.width = width * debugScale + 'px'
      this.strokeCanvas.el.style.height = height * debugScale + 'px'
      debugBox.querySelector('.canvas')?.appendChild(this.canvas.el)
      debugBox.querySelector('.stroke')?.appendChild(this.strokeCanvas.el)
    }

    // キャンバス上のマウスイベントを初期化
    useDragEvent(
      this.view.el,
      (ev) => this.onDown(ev),
      (ev, dist) => this.onMove(ev, dist),
      (ev, dist) => this.onUp(ev, dist),
      MIN_CURSOR_MOVE
    )

    this.pen = new Pen()
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
    if (v) {
      const c = this.penCount
      this.penCount = 1
      this.penCount = c
    }
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

  /** ズーム変更操作発生時のリスナーを登録します。ズームを行うにはリスナー側で座標系(coord.scale)を変更します */
  listenRequestZoom(
    ...params: Parameters<typeof this.requestChangeZoom.listen>
  ) {
    this.requestChangeZoom.listen(...params)
  }
  /** スクロール操作発生時のリスナーを登録します。スクロールを行うにはリスナー側で座標系(coord.scroll)を変更します */
  listenRequestScrollTo(
    ...params: Parameters<typeof this.requestScrollTo.listen>
  ) {
    this.requestScrollTo.listen(...params)
  }
  /** 回転操作発生時のリスナーを登録します。回転を行うにはリスナー側で座標系(coord.angle)を変更します */
  listenRequestRotateTo(
    ...params: Parameters<typeof this.requestRotateTo.listen>
  ) {
    this.requestRotateTo.listen(...params)
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
    this.eventStatus.startPoint = this.event2canvasPoint(ev)
    this.eventStatus.isCapturing = ev.metaKey

    if (action === 'zoomup' || action === 'zoomdown') {
      if (action === 'zoomup') this.requestChangeZoom.fire(true)
      if (action === 'zoomdown') this.requestChangeZoom.fire(false)
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
  private onMove(ev: PointerEvent, dist: PointsDist) {
    const action = this.eventStatus.activeEvent
    if (action === 'draw') {
      this.continueStroke(this.event2canvasPoint(ev), ev.pressure || 0.5)
    }
    if (action === 'draw:line') {
      clearCanvas(this.strokeCanvas)
      this.pen.moveTo(this.eventStatus.startPoint)
      this.continueStroke(this.event2canvasPoint(ev), ev.pressure || 0.5)
    }
    if (action === 'draw:stamp' && this.stamp) {
      clearCanvas(this.strokeCanvas)
      const dp = this.event2canvasPoint(ev).sub(this.eventStatus.startPoint)
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
    const hasPaint =
      action === 'draw' || action === 'draw:line' || action === 'draw:stamp'
    if (action === 'draw') {
      this.continueStroke(this.event2canvasPoint(ev), ev.pressure || 0)
    }
    if (action === 'draw:line') {
      clearCanvas(this.strokeCanvas)
      this.pen.moveTo(this.eventStatus.startPoint)
      this.continueStroke(
        this.event2canvasPoint(ev),
        this.history.current
          ? getStrokeEndPressure(this.history.current.inputs)
          : 0.5
      )
      this.history.current?.clearPoints(true, true) // ストローク履歴の中間を捨てる
    }
    if (action === 'draw:stamp' && this.stamp) {
      clearCanvas(this.strokeCanvas)
      const dp = this.event2canvasPoint(ev).sub(this.eventStatus.startPoint)
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
    this.strokeCanvas.ctx.strokeStyle = this.eventStatus.isCapturing
      ? '#0044aa'
      : this.style.color

    // ストロークの記録を開始
    this.history.start(this.coord, this.pen.state, this.style)
    this.history.current?.addPoint(p, 0.5)
    // 一時キャンバス上でストロークを開始
    this.pen.moveTo(p)
  }

  /**
   * 現在のストロークに座標を入力してストロークを継続します。
   * スクロークは一時キャンバスを経由して描画されます。
   * 履歴に座標を追加します。
   */
  private continueStroke(p: Point, pressure = 0.5) {
    this.history.current?.addPoint(p, pressure)
    this.pen.drawTo(this.strokeCanvas, new DOMMatrix(), p, pressure)
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
      this.strokeCanvas.copy(this.canvas.ctx, { alpha: this.style.alpha })
      clearCanvas(this.strokeCanvas)
    } else {
      this.history.rollback()
      clearCanvas(this.strokeCanvas)
    }
    this.eventStatus.isUseStrokeCanvas = false
    this.eventStatus.activeEvent = undefined
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
    const recPen = new Pen()
    recPen.state = rec.penState
    recPen.coord = recPen.coord.clone({ scroll: p, scale, angle })
    pen.leafs.forEach((leaf) => leaf.addChildPen())
    pen.leafs.forEach((leaf) => (leaf.state = recPen.state))
    const stampRec = new StrokeRecord(
      this.coord,
      pen.state,
      this.style,
      rec.tool
    )
    stampRec.inputs.push(...rec.inputs)
    replayPenStroke(this.strokeCanvas, stampRec, isPreview)
    this.rePaint()

    const currentHist = this.history.current
    if (!isPreview && currentHist) {
      this.history.rollback()
      const newHist = this.history.start(
        currentHist.canvasCoord,
        pen.state,
        this.style,
        currentHist.tool
      )
      newHist.inputs.push(...rec.inputs)
    }
  }

  private rePaint() {
    fillCanvas(this.view, '#cccccc')
    this.canvas.output(this.view.ctx, { background: this.backgroundColor })
    if (this.eventStatus.isUseStrokeCanvas) {
      this.strokeCanvas.output(this.view.ctx, { alpha: this.style.alpha })
    }
    if (this.penCount >= 2) {
      paintKaraidGrid(this.view, this.penCount, this.isKaleido)
    }
  }
}
