import { Coordinate } from './Coordinate'
import { Point } from './Point'

export class AbstractCanvas {
  readonly el: HTMLCanvasElement
  readonly ctx: CanvasRenderingContext2D
  private _coord: Coordinate

  constructor(w: number, h: number) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Failed to get 2d context for canvas')
    canvas.width = w
    canvas.height = h
    canvas.style.border = '1px solid #aaa'
    this.el = canvas
    this.ctx = ctx
    this._coord = new Coordinate()
  }

  set coord(c: Coordinate) {
    this._coord = c
    this.ctx.resetTransform()
    this.ctx.scale(1 / c.scale, 1 / c.scale)
    this.ctx.translate(-c.anchor.x, -c.anchor.y)
    this.ctx.rotate((-c.angle / 180) * Math.PI)
    this.ctx.translate(c.anchor.x, c.anchor.y)
    this.ctx.translate(c.scroll.x, c.scroll.y)
  }

  get coord() {
    return this._coord
  }

  moveTo(p: Point) {
    this.ctx.moveTo(p.x, p.y)
  }
  drawTo(p: Point) {
    this.ctx.lineTo(p.x, p.y)
    this.ctx.stroke()
  }

  output(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    ctx.save()
    const c = this.coord
    ctx.resetTransform()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.translate(-c.scroll.x, -c.scroll.y)
    ctx.translate(-c.anchor.x, -c.anchor.y)
    ctx.rotate((c.angle / 180) * Math.PI)
    ctx.translate(c.anchor.x, c.anchor.y)
    ctx.scale(c.scale, c.scale)
    ctx.drawImage(this.el, 0, 0)
    ctx.strokeStyle = '#aaaaaa'
    ctx.strokeRect(0, 0, canvas.width, canvas.height)
    ctx.restore()
  }
}
