import './style.css'
import { PaintCanvas } from './canvas/PaintCanvas'
import { SettingPalette } from './controls/SettingPalette'
import { getNextZoom } from './controls/zoomTable'

// 配置先DOM要素を取得
const elMain = document.querySelector<HTMLDivElement>('#main')!
const elPalette = document.querySelector<HTMLDivElement>('#palette')!

/** 設定パレット */
const setting = new SettingPalette(elPalette)
/** メインキャンバス */
const canvas = new PaintCanvas(elMain)

// 設定変更をリッスン
setting.onScaleChange.listen((scale) => {
  canvas.coord = canvas.coord.clone({ scale })
})
setting.onAngleChange.listen((angle) => {
  canvas.coord = canvas.coord.clone({ angle })
})
setting.onScrollChange.listen((scroll) => {
  canvas.coord = canvas.coord.clone({ scroll })
})
setting.onPenCountChange.listen((count) => {
  canvas.penCount = count
})
setting.onPenWidthChange.listen((width) => {
  canvas.penWidth = width
})
setting.onClear.listen(() => {
  canvas.clear()
})

// 初期設定の座標系をパレットから取得してキャンバスに反映
canvas.coord = canvas.coord.clone({
  scroll: setting.scroll,
  scale: setting.scale,
  angle: setting.angle,
})

// キャンバスからの変更要求を受け取りパレットの設定を変更
canvas.listenRequestZoom((isUp) => {
  setting.scale = getNextZoom(setting.scale, isUp)
})
canvas.listenRequestScrollTo((pos) => {
  setting.scrollX = pos.x
  setting.scrollY = pos.y
})
canvas.listenRequestRotateTo((angle) => {
  setting.angle = angle
})

// キー操作でツール設定を変更
window.addEventListener('keydown', (ev) => {
  if (ev.key === 'ArrowUp') {
    setting.penCount++
  }
  if (ev.key === 'ArrowDown') {
    setting.penCount--
  }
})

// iOSのスクロール無効化
window.addEventListener('touchmove', function(event) {
  event.preventDefault();
});