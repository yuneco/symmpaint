import { AbstractCanvas } from './AbstractCanvas'
import { Coordinate } from './Coordinate'
import { DragWatcher } from './DragWatcher'
import { KeyPressWatcher } from './KeyPressWatcher'
import { PaintEvent } from './PaintEvent'
import { Point } from './Point'
import { actionCursor, keysAction, PointerAction } from './pointerAction'

const WIDTH = 800
const HEIGHT = 800
const RESOLUTION = 1 //window.devicePixelRatio

type EventStatus = {
  isWatchMove: boolean
  activeEvent: PointerAction | undefined
  startCoord: Coordinate
}

export class PaintCanvas {
  private readonly canvas: AbstractCanvas
  private readonly view: AbstractCanvas
  private readonly keyWatcher: KeyPressWatcher
  private readonly dragWatcher: DragWatcher
  private readonly eventStatus: EventStatus = {
    isWatchMove: false,
    activeEvent: undefined,
    startCoord: new Coordinate()
  }
  private readonly requestChangeZoom = new PaintEvent<boolean>()
  private readonly requestScrollTo = new PaintEvent<Point>()
  private readonly requestRotateTo = new PaintEvent<number>()

  private _penCount = 1

  constructor(parent: HTMLElement) {
    this.canvas = new AbstractCanvas(WIDTH * RESOLUTION, HEIGHT * RESOLUTION)
    this.view = new AbstractCanvas(WIDTH * RESOLUTION, HEIGHT * RESOLUTION)
    parent.appendChild(this.view.el)
    this.registerEventHandlers()

    // キー状態の変更監視
    this.keyWatcher = new KeyPressWatcher()
    this.keyWatcher.listen(() => {
      // キー押下状態変更時にカーソルを更新
      this.view.el.style.cursor = actionCursor(keysAction(this.keyWatcher.keys))
    })

    // ドラッグ操作の状態監視
    this.dragWatcher = new DragWatcher(this.view.el)
    this.dragWatcher.listenMove(({dStart}) => {
      const scroll = this.eventStatus.startCoord.scroll.move(dStart)
      this.requestScrollTo.fire(scroll)
    })
    this.dragWatcher.listenRotate(({dStart}) => {
      const angle = this.eventStatus.startCoord.angle + dStart
      this.requestRotateTo.fire(angle)
    })
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
    this.canvas.coord = c.clone({ anchor: new Point(-WIDTH / 2, -HEIGHT / 2) })
    this.canvas.output(this.view.el, this.view.ctx)
  }

  get penCount() {
    return this._penCount
  }
  set penCount(n: number) {
    if (n === this.penCount) return
    const pen = this.canvas.pen
    pen.clearChildren()
    if (n <= 1) return
    for (let penNo = 1; penNo < n; penNo++) {
      pen.addChildPen(new Coordinate({ angle: (penNo * 360) / n }))
    }
  }

  set penWidth(v: number) {
    this.canvas.pen.changeLineWidth(v)
  }

  listenRequestZoom(
    ...params: Parameters<typeof this.requestChangeZoom.listen>
  ) {
    this.requestChangeZoom.listen(...params)
  }
  listenRequestScrollTo(
    ...params: Parameters<typeof this.requestScrollTo.listen>
  ) {
    this.requestScrollTo.listen(...params)
  }
  listenRequestRotateTo(
    ...params: Parameters<typeof this.requestRotateTo.listen>
  ) {
    this.requestRotateTo.listen(...params)
  }


  clear() {
    this.canvas.clear()
    this.canvas.output(this.view.el, this.view.ctx)
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
      this.drawTo(this.event2canvasPoint(ev), ev.pressure)
    }
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
    this.canvas.moveTo(p)
  }
  private drawTo(p: Point, pressure = 0.5) {
    this.canvas.drawTo(p, pressure)
    this.canvas.output(this.view.el, this.view.ctx)
  }
}
