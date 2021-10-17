import { AbstractCanvas } from './AbstractCanvas'
import { Coordinate } from '../coords/Coordinate'
import { DragWatcher } from '../events/DragWatcher'
import { KeyPressWatcher } from '../events/KeyPressWatcher'
import { PaintEvent } from '../events/PaintEvent'
import {
  clearCanvas,
  fillCanvas,
  paintKaraidGrid,
  paintOutBorder,
} from './paintGrid'
import { Point } from '../coords/Point'
import {
  actionCursor,
  keysAction,
  PointerAction,
} from '../events/pointerAction'
import { normalizeAngle } from '../coords/CoordUtil'
import { CanvasHistory } from './CanvasHistory'
import { getStrokeEndPressure } from './getStrokePressure'
import { Pen } from './Pen'

// TODO: サイズは可変にする
const WIDTH = 800
const HEIGHT = 800
// TODO: Retina対応
const RESOLUTION = 1 //window.devicePixelRatio

/** カーソル移動を検出する最低距離(px) */
const MIN_CURSOR_MOVE = 3.0

type EventStatus = {
  /** ドラッグ操作を監視中か？ */
  isWatchMove: boolean
  /** ストローク用の一時キャンバスが有効か？ */
  isUseStrokeCanvas: boolean
  /** 現在のストロークで実行中の操作 */
  activeEvent: PointerAction | undefined
  /** 現在のストローク開始時の座標系（スクロールや回転で使用） */
  startCoord: Coordinate
  /** 現在のストローク開始時の座標 */
  startPoint: Point
}

export class PaintCanvas {
  /** 描画バッファCanvas */
  private readonly canvas: AbstractCanvas
  /** 描画中のストロークを保持するバッファCanvas */
  private readonly strokeCanvas: AbstractCanvas
  /** 表示用Canvas */
  private readonly view: AbstractCanvas

  /** キー操作監視 */
  private readonly keyWatcher: KeyPressWatcher
  /** ドラッグ操作監視 */
  private readonly dragWatcher: DragWatcher
  /** 現在実行中のストロークイベントの状態 */
  private readonly eventStatus: EventStatus = {
    isWatchMove: false,
    isUseStrokeCanvas: false,
    activeEvent: undefined,
    startCoord: new Coordinate(),
    startPoint: new Point(),
  }
  /** 履歴 */
  private readonly history: CanvasHistory
  // 変更通知イベント

  private readonly requestChangeZoom = new PaintEvent<boolean>()
  private readonly requestScrollTo = new PaintEvent<Point>()
  private readonly requestRotateTo = new PaintEvent<number>()

  private pen: Pen

  /**
   * キャンバスを生成します
   * @param parent キャンバス挿入先
   */
  constructor(parent: HTMLElement) {
    // 描画先・表示先を生成
    this.canvas = new AbstractCanvas(WIDTH * RESOLUTION, HEIGHT * RESOLUTION)
    this.strokeCanvas = new AbstractCanvas(
      WIDTH * RESOLUTION,
      HEIGHT * RESOLUTION
    )
    this.view = new AbstractCanvas(WIDTH * RESOLUTION, HEIGHT * RESOLUTION)
    this.history = new CanvasHistory(WIDTH * RESOLUTION, HEIGHT * RESOLUTION)

    // canvas要素をDOMに挿入
    parent.appendChild(this.view.el)
    parent.appendChild(this.strokeCanvas.el)

    // キャンバス上のマウスイベントを初期化
    this.registerEventHandlers()

    // キー状態の変更監視
    this.keyWatcher = new KeyPressWatcher()
    this.keyWatcher.listen(() => {
      // キー押下状態変更時にカーソルを更新
      this.view.el.style.cursor = actionCursor(keysAction(this.keyWatcher.keys))
    })

    // ドラッグ操作の状態監視
    this.dragWatcher = new DragWatcher(this.view.el)
    this.dragWatcher.listenMove(({ dStart }) => {
      const scroll = this.eventStatus.startCoord.scroll.move(dStart)
      this.requestScrollTo.fire(scroll)
    })
    this.dragWatcher.listenRotate(({ dStart }) => {
      const angle = normalizeAngle(this.eventStatus.startCoord.angle + dStart)
      this.requestRotateTo.fire(angle)
    })

    this.pen = new Pen()
    //this.pen.coord = new Coordinate({scroll: new Point(400, 400)})

    this.clear(false)
  }

  /** 入力キャンバスに対するイベントハンドラを初期化します */
  private registerEventHandlers() {
    const inp = this.view.el
    let lastRawPoint = new Point()

    inp.addEventListener('pointerdown', (ev: PointerEvent) => {
      lastRawPoint = new Point(ev.screenX, ev.screenY)
      this.onDown(ev)
    })

    // カーソルドラッグ： ドラッグ監視中かつ一定量以上の移動があった場合にonMoveを実行
    inp.addEventListener('pointermove', (ev: PointerEvent) => {
      if (!this.eventStatus.isWatchMove) return
      const p = new Point(ev.screenX, ev.screenY)
      if (p.sub(lastRawPoint).length < MIN_CURSOR_MOVE) return
      this.onMove(ev)
      lastRawPoint = p
    })

    // ドラッグ終了： ドラッグ監視中の場合にonMoveを実行
    inp.addEventListener(
      'pointerup',
      (ev: PointerEvent) => this.eventStatus.isWatchMove && this.onUp(ev)
    )
  }

  get coord() {
    return this.canvas.coord
  }

  set coord(c: Coordinate) {
    // anchor(回転軸)のみ画面中央に調整してセット
    this.canvas.coord = c.clone({})
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
      pen.addChildPen(new Coordinate({ angle: (penNo * 360) / n }))
    }
    this.rePaint()
  }

  set penWidth(v: number) {
    this.pen.changeLineWidth(v)
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
      this.history.start(this.coord, this.pen.state, 'clearAll')
      this.history.commit()
    }
    this.canvas.clear()
    paintOutBorder(this.canvas)
    this.rePaint()
  }

  /** 最後のストロークを取り消します */
  undo() {
    if (!this.history.undoable) return
    this.clear(false)
    this.history.undo(this.canvas)
    this.rePaint()
  }

  private event2canvasPoint(ev: PointerEvent): Point {
    return new Point(
      ev.offsetX * RESOLUTION - WIDTH / 2,
      ev.offsetY * RESOLUTION - HEIGHT / 2
    )
  }

  private onDown(ev: PointerEvent) {
    const action = keysAction(this.keyWatcher.keys)
    this.eventStatus.activeEvent = action
    this.eventStatus.startCoord = this.coord
    this.eventStatus.startPoint = this.event2canvasPoint(ev)

    if (action === 'draw' || action === 'draw:line') {
      this.eventStatus.isWatchMove = true
      this.startStroke(this.eventStatus.startPoint)
    }
    if (action === 'zoomup') this.requestChangeZoom.fire(true)
    if (action === 'zoomdown') this.requestChangeZoom.fire(false)
    if (action === 'scroll') {
      this.eventStatus.isWatchMove = true
      this.dragWatcher.watchingAction = 'dragmove'
    }
    if (action === 'rotate') {
      this.eventStatus.isWatchMove = true
      this.dragWatcher.watchingAction = 'dragrotate'
    }
  }
  private onMove(ev: PointerEvent) {
    const action = this.eventStatus.activeEvent
    if (action === 'draw') {
      this.continueStroke(this.event2canvasPoint(ev), ev.pressure || 0.5)
    }
    if (action === 'draw:line') {
      clearCanvas(this.strokeCanvas)
      this.pen.moveTo(this.eventStatus.startPoint)
      this.continueStroke(this.event2canvasPoint(ev), ev.pressure || 0.5)
    }
    ev.preventDefault()
  }
  private onUp(ev: PointerEvent) {
    const action = this.eventStatus.activeEvent
    const hasPaint = action === 'draw' || action === 'draw:line'
    if (action === 'draw') {
      this.continueStroke(this.event2canvasPoint(ev), ev.pressure || 0)
    }
    if (action === 'draw:line') {
      clearCanvas(this.strokeCanvas)
      this.pen.moveTo(this.eventStatus.startPoint)
      this.continueStroke(
        this.event2canvasPoint(ev),
        this.history.current ? getStrokeEndPressure(this.history.current) : 0.5
      )
      this.history.current?.clearPoints(true, true) // ストローク履歴の中間を捨てる
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
    // ストロークの記録を開始
    this.history.start(this.coord, this.pen.state)
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
      this.history.commit()
      // 一時キャンバスの内容をキャンバスに転送
      this.strokeCanvas.copy(this.canvas.ctx)
      clearCanvas(this.strokeCanvas)
    } else {
      this.history.rollback()
      clearCanvas(this.strokeCanvas)
    }
    this.eventStatus.isWatchMove = false
    this.eventStatus.isUseStrokeCanvas = false
    this.eventStatus.activeEvent = undefined
    this.dragWatcher.watchingAction = undefined
  }

  private rePaint() {
    fillCanvas(this.view, '#cccccc')
    this.canvas.output(this.view.ctx)
    if (this.eventStatus.isUseStrokeCanvas) {
      this.strokeCanvas.output(this.view.ctx)
    }
    if (this.penCount >= 2) {
      paintKaraidGrid(this.view, this.penCount)
    }
  }
}
