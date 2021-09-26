import { PaintEvent } from "./PaintEvent"
import { Point } from "../coords/Point"

/** 監視可能な操作 */
type DragAction = 'dragmove' | 'dragrotate'

/** 指定の要素の中央を返します */
const elementCenter = (el: HTMLElement): Point => {
  return new Point(el.offsetWidth / 2, el.offsetHeight / 2)
}

/** 角AOBを求めます */
const pointsAngle = (pO: Point, pA: Point, pB: Point): number => {
  const angleA = pA.sub(pO).angle
  const angleB = pB.sub(pO).angle
  return angleB - angleA
}

/** ドラッグ操作の監視を行います */
export class DragWatcher {
  private readonly el: HTMLElement
  /** ドラッグ開始点 */
  private startPoint: Point = new Point()
  /** 直近のドラッグ地点 */
  private lastPoint: Point = new Point()
  /** ドラッグ監視中か？ */
  private isMoveWatching = false

  private readonly onMoved = new PaintEvent<{dStart: Point, dLast: Point}>()
  private readonly onRotated = new PaintEvent<{dStart: number, dLast: number}>()
  /** イベントハンドラ解除関数 */
  private readonly _removeEvents: () => void

  /** 監視対象の操作：ドラッグで行う操作をドラッグの開始前に設定・変更します */
  watchingAction: DragAction | undefined = undefined

  /** 
   * 要素を指定して監視を初期化します。
   * 特定の操作を監視するには初期化後にwatchingActionを設定してください
   */
  constructor(el: HTMLElement) {
    this.el = el

    const onDown = (ev: PointerEvent) => {
      this.isMoveWatching = this.onDown(new Point(ev.offsetX, ev.offsetY))
    }
    const onMove = (ev: PointerEvent) => {
      if (!this.isMoveWatching) return
      this.onDrag(new Point(ev.offsetX, ev.offsetY))
    }

    this.el.addEventListener('pointerdown', onDown)
    this.el.addEventListener('pointermove', onMove)
    this._removeEvents = () => {
      this.el.removeEventListener('pointerdown', onDown)
      this.el.removeEventListener('pointermove', onMove)
    }
  }

  /** マウス押下時の処理 */
  private onDown(p: Point): boolean {
    if (this.watchingAction === 'dragmove') {
      this.startPoint = p
      this.lastPoint = p
      return true
    }
    if (this.watchingAction === 'dragrotate') {
      this.startPoint = p
      this.lastPoint = p
      return true
    }
    return false
  }

  /** マウスドラッグ時の処理 */
  private onDrag(p: Point) {
    if (this.watchingAction === 'dragmove') {
      const dStart = this.startPoint.sub(p)
      const dLast = this.lastPoint.sub(p)
      this.lastPoint = p
      this.onMoved.fire({dStart, dLast})
    }
    if (this.watchingAction === 'dragrotate') {
      const dStart = pointsAngle(elementCenter(this.el), this.startPoint, p)
      const lastAngle = pointsAngle(elementCenter(this.el), this.lastPoint, p)
      const dLast = dStart - lastAngle
      this.lastPoint = p
      this.onRotated.fire({dStart, dLast})
    }
  }

  /**
   * ドラッグで移動が成立した際に繰り返し呼ばれるイベントハンドラーを登録します
   * @param params ドラッグにより移動が発生した際のコールバック。
   * コールバックは次のオブジェクトを引数に取ります： 
   * {
   *   dStart: ドラッグ開始時からの相対移動量(Point)
   *   dLast: 前回イベント発生時からの相対移動量(Point)
   * }
   */
  listenMove(...params: Parameters<typeof this.onMoved.listen>) {
    this.onMoved.listen(...params)
  }

  /**
   * ドラッグで回転が成立した際に繰り返し呼ばれるイベントハンドラーを登録します
   * @param params ドラッグにより移動が発生した際のコールバック。
   * コールバックは次のオブジェクトを引数に取ります： 
   * {
   *   dStart: ドラッグ開始時からの相対回転量
   *   dLast: 前回イベント発生時からの相対回転量
   * }
   */
   listenRotate(...params: Parameters<typeof this.onRotated.listen>) {
    this.onRotated.listen(...params)
  }

  /**
   * 監視を終了して全てのイベントハンドラーをクリアします
   */
  destroy() {
    this._removeEvents()
    this.onMoved.clear()
    this.onRotated.clear()
  }
}