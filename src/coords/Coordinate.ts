import { Point } from './Point'

type CoordinateData = {
  // anchor: Point;
  scroll: Point;
  scale: number;
  angle: number;
}

/**
 * 座標系を保持するイミュータブルなクラスです。
 */
export class Coordinate {
  /**
   * 親座標系からの平行移動量
   */
  readonly scroll: Point
  /**
   * 親座標系からの拡大縮小量
   */
  readonly scale: number
  /**
   * 親座標系からの回転量(deg)
   */
  readonly angle: number

  /** この座標系のDOMMatrix */
  private readonly _matrix: DOMMatrix

  constructor(data?: Partial<CoordinateData>
  ) {
    this.scroll = data?.scroll ?? new Point()
    this.scale = data?.scale ?? 1
    this.angle = data?.angle ?? 0
    this._matrix = new DOMMatrix()
      .translateSelf(this.scroll.x, this.scroll.y)
      .scaleSelf(this.scale)
      .rotateSelf(this.angle)
  }

  toData(): CoordinateData {
    return {
      scroll: this.scroll,
      scale: this.scale,
      angle: this.angle,
    }
  }

  clone(data?: Partial<CoordinateData>): Coordinate {
    const base = this.toData()
    return new Coordinate({...base, ...data})
  }

  get matrix() {
    return this._matrix.translate()
  }

}
