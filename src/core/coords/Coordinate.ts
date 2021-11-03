import { Point } from './Point'

type CoordinateData = {
  // anchor: Point;
  scroll: Point;
  scale: number;
  angle: number;
  flipY: boolean;
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
  /**
   * Y軸の反転
   */
  readonly flipY: boolean

  /** この座標系のDOMMatrix */
  private readonly _matrix: DOMMatrix

  constructor(data?: Partial<CoordinateData | Coordinate>
  ) {
    this.scroll = data?.scroll ?? new Point()
    this.scale = data?.scale ?? 1
    this.angle = data?.angle ?? 0
    this.flipY = data?.flipY ?? false

  this._matrix = new DOMMatrix()
      .translateSelf(this.scroll.x, this.scroll.y)
      .scaleSelf(this.scale, this.scale * (this.flipY ? -1 : 1))
      .rotateSelf(this.angle)
    }

  toData(): CoordinateData {
    return {
      scroll: this.scroll,
      scale: this.scale,
      angle: this.angle,
      flipY: this.flipY
    }
  }

  clone(data?: Partial<CoordinateData | Coordinate>): Coordinate {
    const base = this.toData()
    return new Coordinate({...base, ...data})
  }

  get matrix() {
    return this._matrix.translate(0)
  }

}
