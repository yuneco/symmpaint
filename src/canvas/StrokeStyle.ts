export type StrokeStyleDate = {
  readonly color: string
  readonly penSize: number
  readonly alpha: number
}

export class StrokeStyle {
  readonly color: string
  readonly penSize: number
  readonly alpha: number
  constructor(data?: Partial<StrokeStyleDate>) {
    this.color = data?.color ?? '#000000'
    this.penSize = data?.penSize ?? 10
    this.alpha = data?.alpha ?? 1
  }

  toData(): StrokeStyleDate {
    return {
      color: this.color,
      penSize: this.penSize,
      alpha: this.alpha
    }
  }

  clone(change?: Partial<StrokeStyleDate>) {
    return new StrokeStyle({...this.toData(), ...change})
  }
}
