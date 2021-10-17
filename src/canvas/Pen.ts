import { Coordinate } from '../coords/Coordinate'
import { Point } from '../coords/Point'
import { AbstractCanvas } from './AbstractCanvas'
import { PenInput } from './PenInput'

export type PenState = Readonly<{
  position: Point
  coord: Coordinate
  children: PenState[]
}>

/**
 * キャンバスに線を描画するためのペンです。
 * 色・線は馬頭の一般的なプロパティに加え、独自の座標型を保持しています。
 * また、再帰的に子要素（子ペン）を持つことができます。子要素は親の座標系を継承します。
 */
export class Pen {
  private position: Point = new Point()
  private _coord: Coordinate
  private children: Pen[] = []

  constructor() {
    this._coord = new Coordinate()
  }

  get coord() {
    return this._coord
  }

  set coord(c: Coordinate) {
    this._coord = this._coord.clone({
      scale: c.scale,
      scroll: c.scroll,
      angle: c.angle,
    })
  }

  get childCount() {
    return this.children.length
  }

  get pos() {
    return this.position
  }

  /** 出力コンテキストを除いた全てのペンの状態を子ペンを含めて取得します */
  get state(): PenState {
    return {
      position: this.position,
      coord: this.coord,
      children: this.children.map((ch) => ch.state),
    }
  }

  /** 出力コンテキストを除いた全てのペンの状態を子ペンを含めて復元します */
  set state(st: PenState) {
    this.position = st.position
    this.coord = st.coord
    if (this.children.length > st.children.length) {
      // 不要なペンを削除
      this.children.length = st.children.length
    }
    while (this.children.length < st.children.length) {
      this.addChildPen()
    }
    st.children.forEach((ch, index) => {
      this.children[index].state = ch
    })
  }

  /** 末端の（描画を行う）ペンを配列として返します */
  get leafs(): Pen[] {
    if (!this.childCount) return [this]
    return this.children.flatMap(ch => ch.leafs)
  }

  /**
   * 子ペンを追加します
   * @param coord 子ペンの座標型。省略時は親と同じ
   */
  addChildPen(coord?: Coordinate): Pen {
    const pen = new Pen()
    if (coord) {
      pen.coord = coord
    }
    this.children.push(pen)
    return pen
  }

  clearChildren() {
    this.children.length = 0
  }

  /** ペンを移動します */
  moveTo(p: Point) {
    this.position = p
    this.children.forEach((pen) => pen.moveTo(p))
  }

  /** 指定の座標まで線を引きます */
  drawTo(canvas: AbstractCanvas, matrix: DOMMatrixReadOnly, p: Point, pressure = 0.5, logName = '') {
    const ctx = canvas.ctx
    if (logName) console.group(logName)
    
    const mx = matrix.multiply(this.coord.matrix)
    if (this.childCount === 0) {
      const lp1 = mx.transformPoint(this.position)
      const lp2 = mx.transformPoint(p)
      const baseWidth = ctx.lineWidth
      ctx.beginPath()
      ctx.lineWidth = baseWidth * pressure
      ctx.moveTo(lp1.x, lp1.y)
      ctx.lineTo(lp2.x, lp2.y)
      if (logName) console.log(`${lp1.x} ${lp1.y}, ${lp2.x} ${lp2.y}`)
      ctx.stroke()
      ctx.lineWidth = baseWidth
    }
    this.children.forEach((pen, index) => pen.drawTo(canvas, mx,p, pressure, logName ? `${logName}-${index}`: ''))
    this.position = p
    if (logName) console.groupEnd()
  }

  drawLines(canvas: AbstractCanvas, matrix: DOMMatrixReadOnly, points: Point[], pressure = 0.5) {
    if (points.length < 2) return
    const ctx = canvas.ctx
    const mx = matrix.multiply(this.coord.matrix)
    if (this.childCount === 0) {
      const [firstP, ...lestPs] = points
      const baseWidth = ctx.lineWidth
      ctx.lineWidth = baseWidth * pressure
      ctx.beginPath()
      const p0 = mx.transformPoint(firstP)
      ctx.moveTo(p0.x, p0.y)
      lestPs.forEach(p => {
        const p1 = mx.transformPoint(p)
        ctx.lineTo(p1.x, p1.y)
      })
      ctx.stroke()
      ctx.lineWidth = baseWidth
    }
    this.children.forEach((pen) => pen.drawLines(canvas, mx, points, pressure))
  }

  drayRun(matrix: DOMMatrixReadOnly, inputs: PenInput[]): PenInput[][] {
    const mx = matrix.multiply(this.coord.matrix)
    if (this.childCount === 0) {
      return [inputs.map(inp => {
        const lp = mx.transformPoint(inp.point)
        const out: PenInput = {point: new Point(lp.x, lp.y), pressure: inp.pressure}
        return out
      })]
    }
    return this.children.flatMap(ch => ch.drayRun(mx, inputs))
  }
}
