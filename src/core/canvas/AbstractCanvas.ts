import { Coordinate } from '../coords/Coordinate'
import { Point } from '../coords/Point'

type ImageTransferOption = {
  alpha: number
  background: string
  composition: string
}
export class AbstractCanvas {
  readonly el: HTMLCanvasElement
  readonly ctx: CanvasRenderingContext2D
  readonly width: number
  readonly height: number
  private _coord: Coordinate = new Coordinate()

  constructor(w: number, h: number) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Failed to get 2d context for canvas')
    this.width = w
    this.height = h
    canvas.width = w
    canvas.height = h
    ctx.lineCap = 'round'
    this.el = canvas
    this.ctx = ctx
    this.coord = new Coordinate()
  }

  get centor() {
    return new Point(this.width / 2, this.height / 2)
  }

  set coord(c: Coordinate) {
    const centor = this.centor
    this._coord = c
    this.ctx.resetTransform()
    this.ctx.translate(centor.x, centor.y)
    this.ctx.translate(c.scroll.x, c.scroll.y)
    this.ctx.rotate((-c.angle / 180) * Math.PI)
    this.ctx.scale(1 / c.scale, 1 / c.scale)
  }

  get coord() {
    return this._coord
  }

  output(ctx: CanvasRenderingContext2D, option?: Partial<ImageTransferOption>) {
    const centor = this.centor
    ctx.save()
    const c = this.coord
    ctx.resetTransform()
    ctx.translate(centor.x, centor.y)
    ctx.scale(c.scale, c.scale)
    ctx.rotate((c.angle / 180) * Math.PI)
    ctx.translate(-c.scroll.x, -c.scroll.y)
    ctx.translate(-centor.x, -centor.y)
    this.transferImageTo(ctx, option)
    ctx.restore()
  }

  copy(ctx: CanvasRenderingContext2D, option?: Partial<ImageTransferOption>) {
    ctx.save()
    ctx.resetTransform()
    this.transferImageTo(ctx, option)
    ctx.restore()
  }

  private transferImageTo(ctx: CanvasRenderingContext2D, option?: Partial<ImageTransferOption>) {
    if (this.el.width === 0 || this.el.height === 0) return
    ctx.globalAlpha = option?.alpha ?? 1
    ctx.globalCompositeOperation = option?.composition ?? 'source-over'
    if (option?.background) {
      ctx.fillStyle = option.background
      ctx.fillRect(0, 0, this.width, this.height)
    }
    ctx.drawImage(this.el, 0, 0)
  }
}
