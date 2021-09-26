import { PaintEvent } from "../PaintEvent"
import { Point } from "../Point"
import { Button } from "./Bitton"
import { Slider } from "./Slider"

export class PaintPalette {
  private _scale: number = 0
  private _angle: number = 0
  private _scrollX: number = 0
  private _scrollY: number = 0
  private _penCount: number = 1

  readonly onScaleChange = new PaintEvent<number>()
  readonly onAngleChange = new PaintEvent<number>()
  readonly onScrollChange = new PaintEvent<Point>()
  readonly onPenCountChange = new PaintEvent<number>()
  readonly onClear = new PaintEvent<void>()

  get scale() {
    return this._scale
  }

  get angle() {
    return this._angle
  }

  get scroll() {
    return new Point(this._scrollX, this._scrollY)
  }

  get penCount() {
    return this._penCount
  }

  private set scale(v: number) {
    if (this.scale === v) return
    this._scale = v
    this.onScaleChange.fire(v)
  }

  private set angle(v: number) {
    if (this.angle === v) return
    this._angle = v
    this.onAngleChange.fire(v)
  }

  private set scrollX(v: number) {
    if (this._scrollX === v) return
    this._scrollX = v
    this.onScrollChange.fire(new Point(this._scrollX, this._scrollY))
  }

  private set scrollY(v: number) {
    if (this._scrollY === v) return
    this._scrollY = v
    this.onScrollChange.fire(new Point(this._scrollX, this._scrollY))
  }

  private set penCount(v: number) {
    if (this.penCount === v) return
    this._penCount = v
    this.onPenCountChange.fire(v)
  }

  constructor(parent: HTMLElement) {
    const slScale = new Slider('Scale', 50, 300, 100)
    const slAngle = new Slider('Angle', -180, 180, 0)
    const slX = new Slider('Scroll X', -400, 400, 0)
    const slY = new Slider('Scroll Y', -400, 400, 0)
    const slPenCount = new Slider('Pen Count', 1, 12, 1)
    const btnClear = new Button('Clear All')
    
    parent.appendChild(slScale.el)
    parent.appendChild(slAngle.el)
    parent.appendChild(slX.el)
    parent.appendChild(slY.el)
    parent.appendChild(slPenCount.el)
    parent.appendChild(btnClear.el)

    this.scale = Number(slScale.value) / 100
    this.angle = Number(slAngle.value)
    this.scrollX = Number(slX.value)
    this.scrollY = Number(slY.value)
    this.penCount = Number(slPenCount.value)

    slScale.addEventListener('input', () => {
      this.scale = Number(slScale.value) / 100
    })
    slAngle.addEventListener('input', () => {
      this.angle = Number(slAngle.value)
    })
    slX.addEventListener('input', () => {
      this.scrollX = Number(slX.value)
    })
    slY.addEventListener('input', () => {
      this.scrollY = Number(slY.value)
    })
    slPenCount.addEventListener('input', () => {
      this.penCount = Number(slPenCount.value)
    })
    btnClear.addEventListener('click', () => {
      this.onClear.fire()
    })
  }
}