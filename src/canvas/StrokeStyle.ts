export class StrokeStyle {
  readonly color: string
  readonly penSize: number
  constructor(color = '#00000', penSize = 10) {
    this.color = color
    this.penSize = penSize
  }
}
