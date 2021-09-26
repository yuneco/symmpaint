import { AbstractCanvas } from './AbstractCanvas'
import { Coordinate } from './Coordinate'
import { Point } from './Point'

const WIDTH = 800
const HEIGHT = 800
const RESOLUTION = 1 //window.devicePixelRatio

type EventStatus = {
  isWatchMove: boolean
}

export class PaintCanvas {
  private canvas: AbstractCanvas
  private view: AbstractCanvas
  private eventStatus: EventStatus = {
    isWatchMove: false,
  }

  private _penCount = 1

  constructor(parent: HTMLElement) {
    this.canvas = new AbstractCanvas(WIDTH * RESOLUTION, HEIGHT * RESOLUTION)
    this.view = new AbstractCanvas(WIDTH * RESOLUTION, HEIGHT * RESOLUTION)
    //parent.appendChild(this.canvas.el)
    parent.appendChild(this.view.el)
    this.registerEventHandlers()
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

  clear() {
    this.canvas.clear()
    this.canvas.output(this.view.el, this.view.ctx)
  }

  private event2canvasPoint(ev: PointerEvent): Point {
    return new Point(ev.offsetX * RESOLUTION, ev.offsetY * RESOLUTION)
  }

  private onDown(ev: PointerEvent) {
    this.eventStatus.isWatchMove = true
    this.moveTo(this.event2canvasPoint(ev))
  }
  private onMove(ev: PointerEvent) {
    this.drawTo(this.event2canvasPoint(ev), ev.pressure)
  }
  private onUp(ev: PointerEvent) {
    this.eventStatus.isWatchMove = false
    this.drawTo(this.event2canvasPoint(ev), ev.pressure)
  }

  private moveTo(p: Point) {
    this.canvas.moveTo(p)
  }
  private drawTo(p: Point, pressure = 0.5) {
    this.canvas.drawTo(p, pressure)
    this.canvas.output(this.view.el, this.view.ctx)
  }
}
