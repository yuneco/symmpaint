import { Coordinate } from '../coords/Coordinate'
import { Point } from '../coords/Point'

type ImageTransferOption = {
  alpha: number
}
export class AbstractCanvas {
  readonly el: HTMLCanvasElement
  readonly ctx: CanvasRenderingContext2D
  readonly width: number
  readonly height: number
  private _coord: Coordinate

  constructor(w: number, h: number) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Failed to get 2d context for canvas')
    this.width = w
    this.height = h
    canvas.width = w
    canvas.height = h
    canvas.style.border = '1px solid #aaa'
    ctx.lineCap = 'round'
    this.el = canvas
    this.ctx = ctx
    this._coord = new Coordinate()
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
    //this.ctx.translate(-centor.x, -centor.y)
  }

  get coord() {
    return this._coord
  }

  clear() {
    this.ctx.save()
    this.ctx.resetTransform()
    this.ctx.fillStyle = '#ffffff'
    this.ctx.fillRect(0, 0, this.width, this.height)
    this.ctx.restore()
  }

  output(ctx: CanvasRenderingContext2D, option?: Partial<ImageTransferOption>) {
    const centor = this.centor
    ctx.save()
    ctx.globalAlpha = option?.alpha ?? 1
    const c = this.coord
    ctx.resetTransform()
    ctx.translate(centor.x, centor.y)
    ctx.scale(c.scale, c.scale)
    ctx.rotate((c.angle / 180) * Math.PI)
    ctx.translate(-c.scroll.x, -c.scroll.y)
    ctx.translate(-centor.x, -centor.y)
    ctx.drawImage(this.el, 0, 0)
    ctx.restore()
  }

  copy(ctx: CanvasRenderingContext2D, option?: Partial<ImageTransferOption>) {
    ctx.save()
    ctx.globalAlpha = option?.alpha ?? 1
    ctx.resetTransform()
    ctx.drawImage(this.el, 0, 0)
    ctx.restore()
  }
}
