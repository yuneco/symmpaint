import { AbstractCanvas } from './AbstractCanvas'
import { Coordinate } from '../coords/Coordinate'
import { DragWatcher } from '../events/DragWatcher'
import { KeyPressWatcher } from '../events/KeyPressWatcher'
import { PaintEvent } from '../events/PaintEvent'
import { fillCanvas, paintKaraidGrid, paintOutBorder } from './paintGrid'
import { Point } from '../coords/Point'
import {
  actionCursor,
  keysAction,
  PointerAction,
} from '../events/pointerAction'
import { normalizeAngle } from '../coords/CoordUtil'
import { StrokeRecord } from './StrokeRecord'
import { CanvasHistory } from './CanvasHistory'

// TODO: サイズは可変にする
const WIDTH = 800
const HEIGHT = 800
// TODO: Retina対応
const RESOLUTION = 1 //window.devicePixelRatio

type EventStatus = {
  /** ドラッグ操作を監視中か？ */
  isWatchMove: boolean
  /** 現在のストロークで実行中の操作 */
  activeEvent: PointerAction | undefined
  /** 現在のストローク開始時の座標型（スクロールや回転で使用） */
  startCoord: Coordinate
}

export class PaintCanvas {
  /** 描画バッファCanvas */
  private readonly canvas: AbstractCanvas
  /** 表示用Canvas */
  private readonly view: AbstractCanvas
  /** キー操作監視 */
  private readonly keyWatcher: KeyPressWatcher
  /** ドラッグ操作監視 */
  private readonly dragWatcher: DragWatcher
  /** 現在実行中のストロークイベントの状態 */
  private readonly eventStatus: EventStatus = {
    isWatchMove: false,
    activeEvent: undefined,
    startCoord: new Coordinate(),
  }
  /** 履歴 */
  private readonly history: CanvasHistory
  // 変更通知イベント

  private readonly requestChangeZoom = new PaintEvent<boolean>()
  private readonly requestScrollTo = new PaintEvent<Point>()
  private readonly requestRotateTo = new PaintEvent<number>()

  /**
   * キャンバスを生成します
   * @param parent キャンバス挿入先
   */
  constructor(parent: HTMLElement) {
    // 描画先・表示先を生成
    this.canvas = new AbstractCanvas(WIDTH * RESOLUTION, HEIGHT * RESOLUTION)
    this.view = new AbstractCanvas(WIDTH * RESOLUTION, HEIGHT * RESOLUTION)
    this.history = new CanvasHistory(WIDTH * RESOLUTION, HEIGHT * RESOLUTION)

    // canvas要素をDOMに挿入
    parent.appendChild(this.view.el)

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

    this.clear(false)
  }

  private registerEventHandlers() {
    const inp = this.view.el
    inp.addEventListener('pointerdown', (ev: PointerEvent) => this.onDown(ev))
    inp.addEventListener(
      'pointermove',
      (ev: PointerEvent) => this.eventStatus.isWatchMove && this.onMove(ev)
    )
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
    this.canvas.coord = c.clone({ anchor: new Point(-WIDTH / 2, -HEIGHT / 2) })
    this.rePaint()
  }

  get penCount() {
    return this.canvas.pen.childCount + 1
  }
  set penCount(n: number) {
    if (n === this.penCount) return
    const pen = this.canvas.pen
    // 子ペンを一度クリアして再設定
    pen.clearChildren()
    if (n <= 1) return
    for (let penNo = 1; penNo < n; penNo++) {
      pen.addChildPen(new Coordinate({ angle: (penNo * 360) / n }))
    }
    this.rePaint()
  }

  set penWidth(v: number) {
    this.canvas.pen.changeLineWidth(v)
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
      this.history.push(new StrokeRecord(this.coord, this.canvas.pen.state))
    }
    this.canvas.clear()
    paintOutBorder(this.canvas)
    this.rePaint()
  }

  /** 最後のストロークを取り消します */
  undo() {
    this.clear(false)
    this.history.undo(this.canvas)
    this.rePaint()
  }

  private event2canvasPoint(ev: PointerEvent): Point {
    return new Point(ev.offsetX * RESOLUTION, ev.offsetY * RESOLUTION)
  }

  private onDown(ev: PointerEvent) {
    const action = keysAction(this.keyWatcher.keys)
    this.eventStatus.activeEvent = action
    this.eventStatus.startCoord = this.coord

    if (action === 'draw') {
      this.eventStatus.isWatchMove = true
      this.moveTo(this.event2canvasPoint(ev))
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
      this.drawTo(this.event2canvasPoint(ev), ev.pressure || 0.5)
    }
    ev.preventDefault()
  }
  private onUp(ev: PointerEvent) {
    const action = this.eventStatus.activeEvent
    if (action === 'draw') {
      this.drawTo(this.event2canvasPoint(ev), ev.pressure)
    }
    this.eventStatus.isWatchMove = false
    this.eventStatus.activeEvent = undefined
    this.dragWatcher.watchingAction = undefined
  }

  private moveTo(p: Point) {
    const stroke = new StrokeRecord(this.coord, this.canvas.pen.state)
    this.history.push(stroke)
    stroke.addPoint(p, 0.5)
    this.canvas.moveTo(p)
  }
  private drawTo(p: Point, pressure = 0.5) {
    this.history.current?.addPoint(p, pressure)
    this.canvas.drawTo(p, pressure)
    this.rePaint()
  }

  private rePaint() {
    fillCanvas(this.view, '#cccccc')
    this.canvas.output(this.view.ctx)
    if (this.penCount >= 2) {
      paintKaraidGrid(this.view, this.penCount)
    }
  }
}
