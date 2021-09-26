import { PaintCanvas } from './PaintCanvas'
import { PaintPalette } from './controls/PaintPalette'
import './style.css'
import { getNextZoom } from './controls/zoomTable'

const elMain = document.querySelector<HTMLDivElement>('#main')!
const elPalette = document.querySelector<HTMLDivElement>('#palette')!

const setting = new PaintPalette(elPalette)
const canvas = new PaintCanvas(elMain)

setting.onScaleChange.listen((scale) => {
  canvas.coord = canvas.coord.clone({ scale })
})
setting.onAngleChange.listen((angle) => {
  canvas.coord = canvas.coord.clone({ angle })
})
setting.onScrollChange.listen((scroll) => {
  canvas.coord = canvas.coord.clone({ scroll })
})

canvas.coord = canvas.coord.clone({
  scroll: setting.scroll,
  scale: setting.scale,
  angle: setting.angle,
})

setting.onPenCountChange.listen((count) => {
  canvas.penCount = count
})

setting.onClear.listen(() => {
  canvas.clear()
})

// キャンバスからの変更要求
canvas.listenRequestZoom((isUp) => {
  setting.scale = getNextZoom(setting.scale, isUp)
})
