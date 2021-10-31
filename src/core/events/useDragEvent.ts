import { Point } from '../coords/Point'
import { PointsDist } from '../coords/PointsDist'

type DownHandler = (ev: PointerEvent) => boolean
type DragHandler = (ev: PointerEvent, dist: PointsDist) => void
type UpHandler = (ev: PointerEvent, dist: PointsDist) => void
type Canceler = () => void

/** 指定の要素の中央をウインドウ座標（ClientX,Y）で返します */
const elementCenter = (el: HTMLElement): Point => {
  const r = el.getBoundingClientRect()
  return new Point(r.left + r.width / 2, r.top + r.height / 2)
}

/** 角AOBを求めます */
const pointsAngle = (pO: Point, pA: Point, pB: Point): number => {
  const angleA = pA.sub(pO).angle
  const angleB = pB.sub(pO).angle
  return angleB - angleA
}

const distForPoint = (
  el: HTMLElement,
  pStart: Point,
  pEnd: Point
): PointsDist => ({
  distance: pEnd.sub(pStart),
  angle: pointsAngle(elementCenter(el), pStart, pEnd),
})

export const useDragEvent = (
  target: HTMLElement,
  ondown: DownHandler,
  ondrag: DragHandler,
  onup: UpHandler,
  minDragMargin = 1
): Canceler => {
  const state = {
    startPoint: new Point(),
    lastRawPoint: new Point(),
    isWatchMove: false,
  }

  const handlerDown = (ev: PointerEvent) => {
    if (!ev.isPrimary) return
    state.startPoint = state.lastRawPoint = new Point(ev.clientX, ev.clientY)
    state.isWatchMove = ondown(ev)
  }

  const handlerMove = (ev: PointerEvent) => {
    if (!ev.isPrimary) return
    if (!state.isWatchMove) return
    const p = new Point(ev.clientX, ev.clientY)
    if (p.sub(state.lastRawPoint).length < minDragMargin) return
    ondrag(ev, distForPoint(target, state.startPoint, p))
    state.lastRawPoint = p
  }

  const handlerUp = (ev: PointerEvent) => {
    if (!ev.isPrimary) return
    if (!state.isWatchMove) return
    const p = new Point(ev.clientX, ev.clientY)
    onup(ev, distForPoint(target, state.startPoint, p))
    state.isWatchMove = false
  }

  target.addEventListener('pointerdown', handlerDown)
  target.addEventListener('pointermove', handlerMove)
  target.addEventListener('pointerup', handlerUp)

  const canceler = () => {
    target.removeEventListener('pointerdown', handlerDown)
    target.removeEventListener('pointermove', handlerMove)
    target.removeEventListener('pointerup', handlerUp)
  }

  return canceler
}
