import { Coordinate } from './Coordinate'
import { PaintCanvas } from './PaintCanvas'
import { PaintPalette } from './PaintPalette'
import './style.css'

const elMain = document.querySelector<HTMLDivElement>('#main')!
const elPalette = document.querySelector<HTMLDivElement>('#palette')!

const setting = new PaintPalette(elPalette)
const canvas = new PaintCanvas(elMain)

setting.onScaleChange.listen(scale => {
  canvas.coord = new Coordinate(canvas.coord.anchor, canvas.coord.scroll, scale, canvas.coord.angle)
})
setting.onAngleChange.listen(angle => {
  canvas.coord = new Coordinate(canvas.coord.anchor,canvas.coord.scroll, canvas.coord.scale, angle)
})
setting.onScrollChange.listen(offset => {
  canvas.coord = new Coordinate(canvas.coord.anchor, offset, canvas.coord.scale, canvas.coord.angle)
})
canvas.coord = new Coordinate(canvas.coord.anchor, setting.scroll, setting.scale, setting.angle)
