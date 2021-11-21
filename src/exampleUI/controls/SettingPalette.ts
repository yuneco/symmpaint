/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import { PaintEvent } from '../../core/events/PaintEvent'
import { Point } from '../../core/coords/Point'
import { Button } from '../ui/Bitton'
import { Slider } from '../ui/Slider'
import { Checkbox } from '../ui/Checkbox'
import { colorSelector } from '../ui/ColorSelector'
import { CanvasToolName } from '../../core/canvas/CanvasToolName'
import { RadioGroup } from '../ui/RadioGroup'
import { isSameArray } from '../../core/misc/ArrayUtil'

const TOOL_NAMES: {[k in CanvasToolName]: string} = {
  draw: 'Draw',
  'draw:line': 'Line',
  'draw:stamp': 'Stamp',
  scroll: 'Move',
  rotate: 'Rotate',
  zoomup: '+',
  zoomdown: '-'
} as const

const toolList = ['draw', 'draw:line', 'draw:stamp', 'scroll', 'zoomup', 'zoomdown', 'rotate'] as const
export class SettingPalette {
  private readonly slScale: Slider
  private readonly slAngle: Slider
  private readonly slX: Slider
  private readonly slY: Slider
  private readonly slPenCount1: Slider
  private readonly slPenCount2: Slider
  private readonly slPenWidth: Slider
  private readonly cbKaleido1: Checkbox
  private readonly cbKaleido2: Checkbox
  private readonly cbEraser: Checkbox
  private readonly csDrawingColor: colorSelector
  private readonly csCanvasColor: colorSelector
  private readonly slDrawingAlpha: Slider

  private readonly cbTools: RadioGroup<typeof toolList>

  readonly onScaleChange = new PaintEvent<number>()
  readonly onAngleChange = new PaintEvent<number>()
  readonly onScrollChange = new PaintEvent<Point>()
  readonly onPenCountChange = new PaintEvent<[number, number]>()
  readonly onPenWidthChange = new PaintEvent<number>()
  readonly onClear = new PaintEvent<void>()
  readonly onUndo = new PaintEvent<void>()
  readonly onCopy = new PaintEvent<void>()
  readonly onKaleidoChange = new PaintEvent<[boolean, boolean]>()
  readonly onEraserChange = new PaintEvent<boolean>()
  readonly onDrawingColorChange = new PaintEvent<string>()
  readonly onCanvasColorChange = new PaintEvent<string>()
  readonly onDrawingAlphaChange = new PaintEvent<number>()
  readonly onToolChange = new PaintEvent<CanvasToolName>()

  private canvasWidth: number
  private canvasHeight: number

  get scale() {
    return this.slScale.value
  }

  get angle() {
    return this.slAngle.value
  }

  get scroll() {
    return new Point(this.slX.value, this.slY.value)
  }

  get penCount() {
    return [this.slPenCount1.value, this.slPenCount2.value]
  }

  get penWidth() {
    return this.slPenWidth.value
  }

  get kaleidoscope() {
    return [this.cbKaleido1.value, this.cbKaleido2.value]
  }

  get drawingColor() {
    return this.csDrawingColor.value
  }

  get canvasColor() {
    return this.csCanvasColor.value
  }

  get drawingAlpha() {
    return this.slDrawingAlpha.value
  }

  get tool() {
    return this.cbTools.value
  }

  get eraser() {
    return this.cbEraser.value
  }

  set scale(v: number) {
    if (this.scale === v) return
    this.slScale.value = v
    this.onScaleChange.fire(this.slScale.value)
    this.updateScrollRange()
  }

  set angle(v: number) {
    if (this.angle === v) return
    this.slAngle.value = v
    this.onAngleChange.fire(this.slAngle.value)
  }

  set scrollX(v: number) {
    if (this.slX.value === v) return
    this.slX.value = v
    this.onScrollChange.fire(new Point(this.slX.value, this.slY.value))
  }

  set scrollY(v: number) {
    if (this.slY.value === v) return
    this.slY.value = v
    this.onScrollChange.fire(new Point(this.slX.value, this.slY.value))
  }

  set penCount(v: [number, number]) {
    if (isSameArray(this.penCount, v)) return
    this.slPenCount1.value = v[0]
    this.slPenCount2.value = v[1]
    this.onPenCountChange.fire([this.slPenCount1.value, this.slPenCount2.value])
  }

  set penWidth(v: number) {
    if (this.penWidth === v) return
    this.slPenWidth.value = v
    this.onPenWidthChange.fire(this.slPenWidth.value)
  }

  set kaleidoscope(v: [boolean, boolean]) {
    if (isSameArray(this.kaleidoscope, v)) return
    this.cbKaleido1.value = v[0]
    this.cbKaleido2.value = v[1]
    this.onKaleidoChange.fire([this.cbKaleido1.value, this.cbKaleido2.value])
  }

  set drawingColor(v: string) {
    if (this.drawingColor === v) return
    this.csDrawingColor.value = v
    this.onDrawingColorChange.fire(this.csDrawingColor.value)
  }

  set canvasColor(v: string) {
    if (this.canvasColor === v) return
    this.csCanvasColor.value = v
    this.onCanvasColorChange.fire(this.csCanvasColor.value)
  }

  set drawingAlpa(v: number) {
    if (this.drawingAlpa === v) return
    this.slDrawingAlpha.value = v
    this.onDrawingAlphaChange.fire(this.slDrawingAlpha.value)
  }

  set tool(v: CanvasToolName) {
    this.cbTools.value = v
  }

  set eraser(v: boolean) {
    this.cbEraser.value = v
  }

  penCountUp() {
    const [c1, c2] = this.penCount
    this.penCount = [c1 + 1, c2]
  }
  penCountDown() {
    const [c1, c2] = this.penCount
    if (c1 <= 1) return
    this.penCount = [c1 - 1, c2]
  }

  private updateScrollRange() {
    const x = (this.canvasWidth / 2) * this.scale
    const y = (this.canvasHeight / 2) * this.scale
    this.slX.elSlider.min = String(-x)
    this.slX.elSlider.max = String(x)
    this.slY.elSlider.min = String(-y)
    this.slY.elSlider.max = String(y)
  }

  constructor(parent: HTMLElement, canvasSetting: {width: number, height: number}) {
    this.canvasWidth = canvasSetting.height
    this.canvasHeight = canvasSetting.height
    const slScale = (this.slScale = new Slider('Scale', 50, 300, 100, true))
    const slAngle = (this.slAngle = new Slider('Angle', -360, 360, 0))
    const slX = (this.slX = new Slider(
      'Scroll X',
      -this.canvasWidth / 2,
      this.canvasWidth / 2,
      0
    ))
    const slY = (this.slY = new Slider(
      'Scroll Y',
      -this.canvasHeight / 2,
      this.canvasHeight / 2,
      0
    ))
    const slPenCount1 = (this.slPenCount1 = new Slider('Pen Count Parent', 1, 16, 1))
    const slPenCount2 = (this.slPenCount2 = new Slider('Pen Count Child', 0, 8, 1))
    const slPenWidth = (this.slPenWidth = new Slider('Pen Size', 2, 100, 20))
    const btnClear = new Button('Clear All')
    const btnUndo = new Button('Undo')
    const btnCopy = new Button('Copy Image')
    const cbKaleido1 = (this.cbKaleido1 = new Checkbox('Kalaidoscope'))
    const cbKaleido2 = (this.cbKaleido2 = new Checkbox('Kalaidoscope'))
    const cbEraser = (this.cbEraser = new Checkbox('Eraser'))
    const csDrawingColor = this.csDrawingColor = new colorSelector('Pen Color')
    const csCanvasColor = this.csCanvasColor = new colorSelector('BG Color')
    const slDrawingAlpha = this.slDrawingAlpha = new Slider('Pen Alpha', 1, 100, 100, true)

    const cbTools = this.cbTools = new RadioGroup(TOOL_NAMES, 'draw')

    // 使わないコントロールは表示しない
    // parent.appendChild(slScale.el)
    // parent.appendChild(slAngle.el)
    // parent.appendChild(slX.el)
    // parent.appendChild(slY.el)
    parent.appendChild(cbTools.el)
    parent.appendChild(cbEraser.el)
    parent.appendChild(csDrawingColor.el)
    parent.appendChild(csCanvasColor.el)

    parent.appendChild(slPenCount1.el)
    parent.appendChild(cbKaleido1.el)
    parent.appendChild(slPenCount2.el)
    parent.appendChild(cbKaleido2.el)
    parent.appendChild(slDrawingAlpha.el)
    parent.appendChild(slPenWidth.el)
    parent.appendChild(btnClear.el)
    parent.appendChild(btnUndo.el)
    parent.appendChild(btnCopy.el)

    slScale.addEventListener('input', () => {
      this.onScaleChange.fire(slScale.value)
    })
    slAngle.addEventListener('input', () => {
      this.onAngleChange.fire(slAngle.value)
    })
    slX.addEventListener('input', () => {
      this.onScrollChange.fire(new Point(slX.value, slY.value))
    })
    slY.addEventListener('input', () => {
      this.onScrollChange.fire(new Point(slX.value, slY.value))
    })
    slPenCount1.addEventListener('input', () => {
      this.onPenCountChange.fire([slPenCount1.value, slPenCount2.value])
    })
    slPenCount2.addEventListener('input', () => {
      this.onPenCountChange.fire([slPenCount1.value, slPenCount2.value])
    })
    slPenWidth.addEventListener('input', () => {
      this.onPenWidthChange.fire(slPenWidth.value)
    })
    btnClear.addEventListener('click', () => {
      this.onClear.fire()
    })
    btnUndo.addEventListener('click', () => {
      this.onUndo.fire()
    })
    btnCopy.addEventListener('click', () => {
      this.onCopy.fire()
    })
    cbKaleido1.addEventListener('change', () => {
      this.onKaleidoChange.fire([cbKaleido1.value, cbKaleido2.value])
    })
    cbKaleido2.addEventListener('change', () => {
      this.onKaleidoChange.fire([cbKaleido1.value, cbKaleido2.value])
    })
    cbEraser.addEventListener('change', () => {
      this.onEraserChange.fire(cbEraser.value)
    })
    csDrawingColor.addEventListener('input', () => {
      this.onDrawingColorChange.fire(csDrawingColor.value)
    })
    csCanvasColor.addEventListener('input', () => {
      this.onCanvasColorChange.fire(csCanvasColor.value)
    })
    slDrawingAlpha.addEventListener('input', () => {
      this.onDrawingAlphaChange.fire(slDrawingAlpha.value)
    })
    cbTools.listenChange((tool) => this.onToolChange.fire(tool))
  }
}
