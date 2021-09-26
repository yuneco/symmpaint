import { PaintEvent } from "./PaintEvent"
import { Point } from "./Point"

type DragAction = 'dragmove' | 'dragrotate'

const elementCenter = (el: HTMLElement): Point => {
  return new Point(el.offsetWidth / 2, el.offsetHeight / 2)
}

const pointsAngle = (pO: Point, pA: Point, pB: Point): number => {
  const angleA = pA.sub(pO).angle
  const angleB = pB.sub(pO).angle
  return angleB - angleA
}

export class DragWatcher {
  private readonly el: HTMLElement
  private startPoint: Point = new Point()
  private lastPoint: Point = new Point()
  private isMoveWatching = false

  private readonly onMoved = new PaintEvent<{dStart: Point, dLast: Point}>()
  private readonly onRotated = new PaintEvent<{dStart: number, dLast: number}>()
  private readonly _removeEvents: () => void

  watchingAction: DragAction | undefined = undefined

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

  listenMove(...params: Parameters<typeof this.onMoved.listen>) {
    this.onMoved.listen(...params)
  }
  listenRotate(...params: Parameters<typeof this.onRotated.listen>) {
    this.onRotated.listen(...params)
  }

  destroy() {
    this._removeEvents()
    this.onMoved.clear()
  }
}