import { Coordinate } from '../coords/Coordinate'
import { Point } from '../coords/Point'
import { AbstractCanvas } from './AbstractCanvas'

export type PenState = Readonly<{
  position: Point
  coord: Coordinate
  color: string
  lineWidth: number
  isDrawSelf: boolean
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

  color: string = '#000000'
  lineWidth: number = 10
  isDrawSelf: boolean = true

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
      color: this.color,
      lineWidth: this.lineWidth,
      isDrawSelf: this.isDrawSelf,
      children: this.children.map((ch) => ch.state),
    }
  }

  /** 出力コンテキストを除いた全てのペンの状態を子ペンを含めて復元します */
  set state(st: PenState) {
    this.position = st.position
    this.coord = st.coord
    this.color = st.color
    this.lineWidth = st.lineWidth
    this.isDrawSelf = st.isDrawSelf
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

  /**
   * 子ペンを追加します
   * @param coord 子ペンの座標型。省略時は親と同じ
   */
  addChildPen(coord?: Coordinate): Pen {
    const pen = new Pen()
    pen.lineWidth = this.lineWidth
    pen.color = this.color
    if (coord) {
      pen.coord = coord
    }
    this.children.push(pen)
    return pen
  }

  clearChildren() {
    this.children.length = 0
  }

  /**
   * ペン幅を変更します
   * @param v ペン幅
   * @param shouldApplyChildren 子ペンにも変更を適用するか？
   */
  changeLineWidth(v: number, shouldApplyChildren = true) {
    this.lineWidth = v
    if (shouldApplyChildren) {
      this.children.forEach((p) => p.changeLineWidth(v))
    }
  }

  /** 描画先に座標型を適用します。save/restoreは行いません */
  private applyCoord(ctx: CanvasRenderingContext2D, anchor: Point) {
    const c: Coordinate = this._coord
    ctx.translate(-c.scroll.x, -c.scroll.y)
    ctx.translate(anchor.x, anchor.y)
    ctx.rotate((c.angle / 180) * Math.PI)
    ctx.scale(c.scale, c.scale)
    ctx.translate(-anchor.x, -anchor.y)
  }

  /** ペンを移動します */
  moveTo(p: Point) {
    this.position = p
    this.children.forEach((pen) => pen.moveTo(p))
  }

  /** 指定の座標まで線を引きます */
  drawTo(canvas: AbstractCanvas, p: Point, pressure = 0.5) {
    const ctx = canvas.ctx
    ctx.save()
    this.applyCoord(ctx, new Point(canvas.width / 2, canvas.height / 2))
    if (this.isDrawSelf) {
      ctx.lineWidth = this.lineWidth * pressure
      ctx.strokeStyle = this.color
      ctx.beginPath()
      ctx.moveTo(this.position.x, this.position.y)
      ctx.lineTo(p.x, p.y)
      ctx.stroke()
    }
    this.children.forEach((pen) => pen.drawTo(canvas, p, pressure))
    ctx.restore()
    this.position = p
  }
}
