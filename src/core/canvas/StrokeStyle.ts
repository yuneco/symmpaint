export type StrokeStyleDate = {
  readonly color: string
  readonly penSize: number
  readonly alpha: number
  readonly composition: string
}

export class StrokeStyle {
  readonly color: string
  readonly penSize: number
  readonly alpha: number
  readonly composition: string
  constructor(data?: Partial<StrokeStyleDate | StrokeStyle>) {
    this.color = data?.color ?? '#000000'
    this.penSize = data?.penSize ?? 10
    this.alpha = data?.alpha ?? 1
    this.composition = data?.composition ?? ''
  }

  toData(): StrokeStyleDate {
    return {
      color: this.color,
      penSize: this.penSize,
      alpha: this.alpha,
      composition: this.composition
    }
  }

  clone(change?: Partial<StrokeStyleDate | StrokeStyle>) {
    return new StrokeStyle({...this.toData(), ...change})
  }
}
