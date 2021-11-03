import { Coordinate } from '../coords/Coordinate'
import { Point } from '../coords/Point'
import { AbstractCanvas } from './AbstractCanvas'
import { PenInput } from './PenInput'

export type PenState = Readonly<{
  coord: Coordinate
  children: PenState[]
}>

/**
 * キャンバスに線を描画するためのペンです。
 * 色・線は馬頭の一般的なプロパティに加え、独自の座標型を保持しています。
 * また、再帰的に子要素（子ペン）を持つことができます。子要素は親の座標系を継承します。
 */
export class Pen {
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
      flipY: c.flipY,
    })
  }

  get childCount() {
    return this.children.length
  }

  /** 出力コンテキストを除いた全てのペンの状態を子ペンを含めて取得します */
  get state(): PenState {
    return {
      coord: this.coord,
      children: this.children.map((ch) => ch.state),
    }
  }

  /** 出力コンテキストを除いた全てのペンの状態を子ペンを含めて復元します */
  set state(st: PenState) {
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


  /** 指定の座標まで線を引きます */
  drawTo(canvas: AbstractCanvas, matrix: DOMMatrixReadOnly, p0: Point, p1: Point, pressure = 0.5) {
    if (pressure <= 0) return
    const ctx = canvas.ctx

    // 先にdryrunで全ての子ペンから描画座標を取得する
    const segments = this.dryRun(matrix, [{point: p0, pressure: 0}, {point: p1, pressure}])
    const baseWidth = ctx.lineWidth
    segments.forEach(([start, end]) => {
      if (!end) return
      ctx.beginPath()
      ctx.moveTo(start.point.x, start.point.y)
      ctx.lineWidth = baseWidth * end.pressure
      ctx.lineTo(end.point.x, end.point.y)
      ctx.stroke()
    })
    ctx.lineWidth = baseWidth
  }

  /**
   * 入力点の配列を渡して折線を描画します。線の太さは一定です
   */
  drawLines(canvas: AbstractCanvas, matrix: DOMMatrixReadOnly, points: Point[], pressure = 0.5) {
    if (points.length < 2) return
    const ctx = canvas.ctx

    const inps = points.map(point => ({point, pressure}))
    const segments = this.dryRun(matrix, inps)
    const baseWidth = ctx.lineWidth
    ctx.lineWidth = baseWidth * pressure
    segments.forEach(seg => {
      const [start, ...lests] = seg
      ctx.beginPath()
      ctx.moveTo(start.point.x, start.point.y)
      lests.forEach(p => {
        ctx.lineTo(p.point.x, p.point.y)
      })
      ctx.stroke()
    })
    ctx.lineWidth = baseWidth
  }

  /**
   * 入力点の配列を子ペンに展開し、実際の描画座標の配列として返します
   */
  dryRun(matrix: DOMMatrixReadOnly, inputs: PenInput[]): PenInput[][] {
    const mx = matrix.multiply(this.coord.matrix)
    if (this.childCount === 0) {
      return [inputs.map(inp => {
        const lp = mx.transformPoint(inp.point)
        const out: PenInput = {point: new Point(lp.x, lp.y), pressure: inp.pressure}
        return out
      })]
    }
    return this.children.flatMap(ch => ch.dryRun(mx, inputs))
  }
}
