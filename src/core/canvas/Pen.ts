import { Coordinate } from '../coords/Coordinate'
import { Point, toPoint } from '../coords/Point'
import { AbstractCanvas } from './AbstractCanvas'
import { PenInput, PenStroke } from './PenInput'
import { drawStrokesWithTransform } from './strokeFuncs/drawStrokesWithTransform'

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
  private _coord: Coordinate = new Coordinate()
  private children: Pen[] = []

  get coord() {
    return this._coord
  }

  set coord(c: Coordinate) {
    this._coord = this._coord.clone(c)
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
    return this.children.flatMap((ch) => ch.leafs)
  }

  childAt(index: number): Pen | undefined {
    return this.children[index]
  }

  /** 末端の（描画を行う）ペンの合成済みmatrixを配列で返します */
  matrices(parent: DOMMatrix): DOMMatrix[] {
    const mx = parent.multiply(this.coord.matrix)
    if (!this.childCount) {
      return [mx]
    }
    return this.children.flatMap((ch) => ch.matrices(mx))
  }

  /** 末端の（描画を行う）ペンの合成済みmatrixを最初の（1本目の）ペンのmatrix基準に変換して返します */
  matricesBasedFirstPen(parent: DOMMatrix): DOMMatrix[] {
    const mxs = this.matrices(parent)
    const mxBase = mxs[0].inverse()
    return mxs.map(mx => mx.multiply(mxBase))
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

  drawStrokes(canvas: AbstractCanvas, strokes: PenStroke[]) {
    const mxs = this.matricesBasedFirstPen(new DOMMatrix())
    drawStrokesWithTransform(canvas.ctx, strokes, mxs)
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

    const mxs = this.matricesBasedFirstPen(new DOMMatrix())
    drawStrokesWithTransform(ctx, [inps], mxs)
  }

  /**
   * 入力点の配列を子ペンに展開し、実際の描画座標の配列として返します
   */
  dryRun(inputs: PenInput[]): PenInput[][] {
    const mxs = this.matrices(new DOMMatrix())
    // 入力座標→基準のペンの座標系
    const mxBase = mxs[0].inverse()

    return mxs.map((mx) => {
      return inputs.map((inp) => {
        const p = mxBase.transformPoint(inp.point)
        return {
          point: toPoint(mx.transformPoint(p)),
          pressure: inp.pressure,
        }
      })
    })
  }
}
