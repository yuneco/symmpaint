/* eslint-disable @typescript-eslint/no-non-null-assertion */
import './style.scss'
import { PaintCanvas } from '../core/canvas/PaintCanvas'
import { SettingPalette } from './controls/SettingPalette'
import { Point } from '../core/coords/Point'
import { ToolKeyWatcher } from '../core/events/ToolKeyWatcher'
import { Coordinate } from '../core/coords/Coordinate'

// 配置先DOM要素を取得
const elMain = document.querySelector<HTMLDivElement>('#main')!
const elPalette = document.querySelector<HTMLDivElement>('#palette')!
const elToast = document.querySelector<HTMLDivElement>('#toast')!

const size = new Point(elMain.offsetWidth, elMain.offsetHeight)

const showToast = (msg: string) => {
  elToast.textContent = msg
  elToast.classList.add('visible')
  setTimeout(() => {
    elToast.classList.remove('visible')
  }, 5000)
}

/** 設定パレット */
const setting = new SettingPalette(elPalette, { width: size.x, height: size.y })
/** メインキャンバス */
const canvas = new PaintCanvas(elMain, size.x, size.y)

const resetAnchorAngle = () => {
  //canvas.anchor = canvas.anchor.clone({angle: 360/canvas.penCount/2})
}

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
  resetAnchorAngle()
})
setting.onPenWidthChange.listen((width) => {
  canvas.penWidth = width
})
setting.onClear.listen(() => {
  const isOk = confirm('Are you sure you want to clear canvas? This action can not undo.')
  if (!isOk) return
  canvas.clear(true)
})
setting.onUndo.listen(() => {
  canvas.undo()
})
const copyImg = async () => {
  // see: https://stackoverflow.com/questions/61187374/how-to-fix-the-cannot-find-name-clipboarditem-error
  let item: ClipboardItem | undefined
  try {
    // for safari
    item = new ClipboardItem({
      'image/png': canvas.toImgBlob(),
    })
  } catch {
    // for chrome
    item = new ClipboardItem({
      'image/png': (await canvas.toImgBlob()) as unknown as ClipboardItemData,
    })
  }
  await navigator.clipboard.write([item])
}
setting.onCopy.listen(() => {
  copyImg().catch((err) => {
    console.error(err)
    alert('failed to copy img.')
  })
})
setting.onKaleidoChange.listen((isKaleido) => {
  canvas.isKaleido = isKaleido
})
setting.onEraserChange.listen((isEraser) => {
  canvas.penKind = isEraser ? 'eraser' : 'normal'
})
setting.onDrawingColorChange.listen((color) => {
  canvas.penColor = color
})
setting.onCanvasColorChange.listen((color) => {
  canvas.backgroundColor = color
})
setting.onDrawingAlphaChange.listen((alpha) => {
  canvas.penAlpha = alpha
})
setting.onToolChange.listen((tool) => {
  canvas.tool = tool
  if (tool === 'draw:stamp' && !canvas.stamp) {
    const msg = {
      ja: 'スタンプを使用するには、先にCommand(Ctrl)を押しながら線を引いてスタンプを記録します',
      en: 'Before using stamp, draw with Command(Ctrl) key for record a stroke.',
    }[uaLang]
    showToast(msg)
  }
})

// 初期設定の座標系をパレットから取得してキャンバスに反映
canvas.coord = canvas.coord.clone({
  scroll: setting.scroll,
  scale: setting.scale,
  angle: setting.angle,
})

// キャンバスからの変更要求を受け取りパレットの設定を変更
canvas.listenRequestZoom((scale) => {
  //setting.scale = scale
  canvas.coord = canvas.coord.clone({ scale })
})
canvas.listenRequestScrollTo(({ point, target }) => {
  if (target === 'canvas') {
    canvas.coord = canvas.coord.clone({ scroll: point })
  }
  if (target === 'anchor') {
    canvas.activeAnchor = canvas.activeAnchor.clone({ scroll: point })
  }
})
canvas.listenRequestRotateTo(({ angle, target }) => {
  if (target === 'canvas') {
    canvas.coord = canvas.coord.clone({ angle })
  }
  if (target === 'anchor') {
    canvas.activeAnchor = canvas.activeAnchor.clone({ angle })
  }
})
canvas.listenRequestUndo(() => {
  canvas.undo()
})
canvas.listenRequestAnchorTransform((coord) => {
  canvas.activeAnchor = coord
})
canvas.listenRequestAnchorReset(() => {
  canvas.anchor = new Coordinate()
  resetAnchorAngle()
})
canvas.listenStrokeStart(() => {
  console.log('start stroke')
})
canvas.listenStrokeEnd(() => {
  console.log('end stroke')
})

// キー操作でツール設定を変更
window.addEventListener('keydown', (ev) => {
  if (ev.key === 'ArrowUp') {
    setting.penCountUp()
  }
  if (ev.key === 'ArrowDown') {
    setting.penCountDown()
  }
  if (ev.key === 'z' && ev.metaKey) {
    setting.onUndo.fire()
  }
  if (ev.key === 'c' && ev.metaKey) {
    setting.onCopy.fire()
  }
})

// キー操作でツール変更
const toolKeyWatcher = new ToolKeyWatcher()
toolKeyWatcher.listenChange((tool) => (setting.tool = tool))

// パレットの初期値設定
setting.kaleidoscope = [true, true]
setting.penCount = [6, 6]
setting.canvasColor = '#ffffff'

// iOSのスクロール無効化
elMain.addEventListener(
  'touchmove',
  function (event) {
    event.preventDefault()
  },
  { passive: false }
)
// パレット領域でのマルチタッチを無効にする
elPalette.addEventListener(
  'touchmove',
  function (event) {
    if (event.touches.length >= 2) {
      event.preventDefault()
    }
  },
  { passive: false }
)

// 説明文の言語切り替え
const uaLang = navigator.language === 'ja' ? 'ja' : 'en'
document
  .querySelectorAll<HTMLElement>('.lang')
  .forEach((el) => (el.style.display = 'none'))
document
  .querySelectorAll<HTMLElement>(`.lang.${uaLang}`)
  .forEach((el) => (el.style.display = ''))

// For Debug
// window.canvas = canvas
// window.Point = Point
// window.Coordinate = Coordinate
