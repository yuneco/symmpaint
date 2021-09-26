import { AbstractCanvas } from "./AbstractCanvas";
import { Point } from "./Point";

export const  clearCanvas = (canvas: AbstractCanvas): void => {
  canvas.ctx.save()
  canvas.ctx.resetTransform()
  canvas.ctx.clearRect(0, 0, canvas.width, canvas.height)
  canvas.ctx.restore()
}

export const paintOutBorder = (canvas: AbstractCanvas): void => {
  canvas.ctx.save()
  canvas.ctx.resetTransform()
  canvas.ctx.strokeStyle = '#aaaaaa'
  canvas.ctx.strokeRect(0, 0, canvas.width, canvas.height)
  canvas.ctx.restore()
}

export const paintKaraidGrid = (canvas: AbstractCanvas, count: number): void => {
  const center = new Point(canvas.width / 2, canvas.height / 2)
  canvas.ctx.save()
  canvas.ctx.resetTransform()
  canvas.ctx.translate(center.x, center.y)
  canvas.ctx.lineWidth = 1
  canvas.ctx.strokeStyle = '#aaddeeaa';
  for(let index = 0; index < count; index++) {
    canvas.ctx.beginPath()
    canvas.ctx.moveTo(0, 0)
    canvas.ctx.lineTo(0, canvas.height)
    canvas.ctx.stroke()
    canvas.ctx.closePath()
    canvas.ctx.rotate((360 / count) / 180 * Math.PI)    
  }
  canvas.ctx.restore()
}