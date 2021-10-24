import { AbstractCanvas } from "../AbstractCanvas";
import { Point } from "../../coords/Point";
import { a2r } from "../../coords/CoordUtil";

/**
 * キャンバスをクリアします
 * @param canvas 
 */
export const  clearCanvas = (canvas: AbstractCanvas): void => {
  canvas.ctx.save()
  canvas.ctx.resetTransform()
  canvas.ctx.clearRect(0, 0, canvas.width, canvas.height)
  canvas.ctx.restore()
}

/**
 * キャンバスを塗りつぶします
 * @param canvas 
 * @param color
 */
 export const  fillCanvas = (canvas: AbstractCanvas, color: string): void => {
  canvas.ctx.save()
  canvas.ctx.resetTransform()
  canvas.ctx.fillStyle = color
  canvas.ctx.fillRect(0, 0, canvas.width, canvas.height)
  canvas.ctx.restore()
}

/**
 * 
 * @param canvas キャンバスに外枠を描きます
 */
export const paintOutBorder = (canvas: AbstractCanvas): void => {
  canvas.ctx.save()
  canvas.ctx.resetTransform()
  canvas.ctx.strokeStyle = '#aaaaaa'
  canvas.ctx.strokeRect(0, 0, canvas.width, canvas.height)
  canvas.ctx.restore()
}

/**
 * 対称描画時の補助線を描画します
 * @param canvas 
 * @param count 対称数
 */
export const paintKaraidGrid = (canvas: AbstractCanvas, count: number, isKaleido: boolean): void => {
  const colMain = '#91bcccbb';
  const colSub = isKaleido ? '#c5e4ebbb' : colMain;

  const center = new Point(canvas.width / 2, canvas.height / 2)
  canvas.ctx.save()
  canvas.ctx.resetTransform()
  canvas.ctx.translate(center.x, center.y)
  canvas.ctx.lineWidth = 1
  canvas.ctx.rotate(a2r(-90 +(360 / count)/2)) 
  for(let index = 0; index < count; index++) {
    canvas.ctx.strokeStyle = index % 2 === 0 ? colMain : colSub;
    canvas.ctx.beginPath()
    canvas.ctx.moveTo(0, 0)
    canvas.ctx.lineTo(0, canvas.height)
    canvas.ctx.stroke()
    canvas.ctx.closePath()
    canvas.ctx.rotate((360 / count) / 180 * Math.PI)    
  }
  canvas.ctx.restore()
}
