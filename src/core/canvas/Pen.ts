import { Coordinate } from '../coords/Coordinate'
import { Point, toPoint } from '../coords/Point'
import { AbstractCanvas } from './AbstractCanvas'
import { PenInput } from './PenInput'

type PenAnchor = {
  position: Point
  angle: number
}
export type PenState = Readonly<{
  coord: Coordinate
  anchor: PenAnchor
  children: PenState[]
}>

/**
 * キャンバスに線を描画するためのペンです。
 * 色・線は馬頭の一般的なプロパティに加え、独自の座標型を保持しています。
 * また、再帰的に子要素（子ペン）を持つことができます。子要素は親の座標系を継承します。
 */
export class Pen {
  private _coord: Coordinate = new Coordinate()
  private children: Pen[] = []
  private _anchor: PenAnchor = {
    position: new Point(),
    angle: 0,
  }

  get coord() {
    return this._coord
  }

  set coord(c: Coordinate) {
    this._coord = this._coord.clone(c)
  }

  get anchor() {
    return { ...this._anchor }
  }

  set anchor(v) {
    this._anchor.position = v.position
    this._anchor.angle = v.angle
  }

  get childCount() {
    return this.children.length
  }

  /** 出力コンテキストを除いた全てのペンの状態を子ペンを含めて取得します */
  get state(): PenState {
    return {
      coord: this.coord,
      anchor: this._anchor,
      children: this.children.map((ch) => ch.state),
    }
  }

  /** 出力コンテキストを除いた全てのペンの状態を子ペンを含めて復元します */
  set state(st: PenState) {
    this.coord = st.coord
    this.anchor = st.anchor
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
    return this.children.flatMap((ch) => ch.leafs)
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

  private anchorShiftInputs(
    inps: PenInput[],
    coord: Coordinate,
    dir: 'add' | 'sub'
  ): PenInput[] {
    const mx = coord.matrixScrollAfter
    const center = toPoint(mx.transformPoint(this._anchor.position.invert))
    const transform =
      dir === 'sub'
        ? (p: Point) => p.move(center).rotate(-coord.angle -this.anchor.angle)
        : (p: Point) => p.rotate(coord.angle +this.anchor.angle).move(center.invert)
    return inps.map((inp) => ({
      point: transform(inp.point),
      pressure: inp.pressure,
    }))
  }

  /** 指定の座標まで線を引きます */
  drawTo(canvas: AbstractCanvas, p0: Point, p1: Point, pressure = 0.5) {
    if (pressure <= 0) return
    const ctx = canvas.ctx
    // 先にdryrunで全ての子ペンから描画座標を取得する
    const ps = [p0, p1]
    const segments = this.dryRun(
      [
        { point: ps[0], pressure: 0 },
        { point: ps[1], pressure },
      ],
      undefined,
      canvas.coord
    )
    const baseWidth = ctx.lineWidth
    segments.forEach(([start, end]) => {
      if (!end) return
      const segPs = [start.point, end.point]
      const [startP, endP] = segPs
      ctx.beginPath()
      ctx.moveTo(startP.x, startP.y)
      ctx.lineWidth = baseWidth * end.pressure
      ctx.lineTo(endP.x, endP.y)
      ctx.stroke()
    })
    ctx.lineWidth = baseWidth
  }

  /**
   * 入力点の配列を渡して折線を描画します。線の太さは一定です
   */
  drawLines(canvas: AbstractCanvas, points: Point[], pressure = 0.5) {
    if (points.length < 2) return
    const ctx = canvas.ctx

    const inps = points.map((point) => ({
      point,
      pressure,
    }))
    const segments = this.dryRun(inps, undefined, canvas.coord)
    const baseWidth = ctx.lineWidth
    ctx.lineWidth = baseWidth * pressure
    segments.forEach((seg) => {
      const segPs = seg.map((inp) => inp.point)
      const [start, ...rests] = segPs
      ctx.beginPath()
      ctx.moveTo(start.x, start.y)
      rests.forEach((p) => {
        ctx.lineTo(p.x, p.y)
      })
      ctx.stroke()
    })
    ctx.lineWidth = baseWidth
  }

  /**
   * 入力点の配列を子ペンに展開し、実際の描画座標の配列として返します
   */
  dryRun(
    inputs: PenInput[],
    matrix: DOMMatrixReadOnly = new DOMMatrixReadOnly(),
    anchorCoord?: Coordinate
  ): PenInput[][] {
    if (anchorCoord) {
      inputs = this.anchorShiftInputs(inputs, anchorCoord, 'sub')
    }
    const mx = matrix.multiply(this.coord.matrix)

    let outs: PenInput[][]
    if (this.childCount === 0) {
      outs = [
        inputs.map((inp) => {
          const lp = mx.transformPoint(inp.point)
          const out: PenInput = {
            point: new Point(lp.x, lp.y),
            pressure: inp.pressure,
          }
          return out
        }),
      ]
    } else {
      outs = this.children.flatMap((ch) => ch.dryRun(inputs, mx))
    }
    return outs.map((inps) =>
      anchorCoord ? this.anchorShiftInputs(inps, anchorCoord, 'add') : inps
    )
  }
}
