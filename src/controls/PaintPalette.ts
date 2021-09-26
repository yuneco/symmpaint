import { PaintEvent } from '../PaintEvent'
import { Point } from '../Point'
import { Button } from '../ui/Bitton'
import { Slider } from '../ui/Slider'

export class PaintPalette {
  private readonly slScale: Slider
  private readonly slAngle: Slider
  private readonly slX: Slider
  private readonly slY: Slider
  private readonly slPenCount: Slider

  readonly onScaleChange = new PaintEvent<number>()
  readonly onAngleChange = new PaintEvent<number>()
  readonly onScrollChange = new PaintEvent<Point>()
  readonly onPenCountChange = new PaintEvent<number>()
  readonly onClear = new PaintEvent<void>()

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
    return this.slPenCount.value
  }

  set scale(v: number) {
    if (this.scale === v) return
    this.slScale.value = v
    this.onScaleChange.fire(this.slScale.value)
  }

  set angle(v: number) {
    if (this.angle === v) return
    this.slAngle.value= v
    this.onAngleChange.fire(this.slAngle.value)
  }

  set scrollX(v: number) {
    if (this.slX.value === v) return
    this.slX.value = v
    this.onScrollChange.fire(new Point(this.slX.value, this.slY.value))
  }

  set scrollY(v: number) {
    if (this.slY.value === v) return
    this.slY.value= v
    this.onScrollChange.fire(new Point(this.slX.value, this.slY.value))
  }

  set penCount(v: number) {
    if (this.penCount === v) return
    this.slPenCount.value = v
    this.onPenCountChange.fire(this.slPenCount.value)
  }

  constructor(parent: HTMLElement) {
    const slScale = (this.slScale = new Slider('Scale', 50, 300, 100, true))
    const slAngle = (this.slAngle = new Slider('Angle', -360, 360, 0))
    const slX = (this.slX = new Slider('Scroll X', -400, 400, 0))
    const slY = (this.slY = new Slider('Scroll Y', -400, 400, 0))
    const slPenCount = (this.slPenCount = new Slider('Pen Count', 1, 12, 1))
    const btnClear = new Button('Clear All')

    parent.appendChild(slScale.el)
    parent.appendChild(slAngle.el)
    parent.appendChild(slX.el)
    parent.appendChild(slY.el)
    parent.appendChild(slPenCount.el)
    parent.appendChild(btnClear.el)

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
    slPenCount.addEventListener('input', () => {
      this.onPenCountChange.fire(slPenCount.value)
    })
    btnClear.addEventListener('click', () => {
      this.onClear.fire()
    })
  }
}
