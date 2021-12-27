import { Point } from '../coords/Point'
import { PointsDist } from '../coords/PointsDist'

type DownHandler = (ev: PointerEvent) => boolean
type DragHandler = (ev: PointerEvent, dist: PointsDist) => void
type UpHandler = (ev: PointerEvent, dist: PointsDist, isCommit: boolean) => void
type Canceler = () => void

/**
 * 基準点の座標をウインドウ座標（ClientX,Y）で返します
 * @param elementCenter 要素のローカル座標における基準点。省略時は嘘の中央
 */
const elementAnchor = (el: HTMLElement, elementCenter?: Point): Point => {
  const r = el.getBoundingClientRect()
  return new Point(r.left, r.top).move(
    elementCenter ?? new Point(r.width / 2, r.height / 2)
  )
}

/** 角AOBを求めます */
const pointsAngle = (pO: Point, pA: Point, pB: Point): number => {
  const angleA = pA.sub(pO).angle
  const angleB = pB.sub(pO).angle
  return angleB - angleA
}

const distForPoint = (
  pCenter: Point,
  pStart: Point,
  pEnd: Point
): PointsDist => ({
  distance: pEnd.sub(pStart),
  angle: pointsAngle(pCenter, pStart, pEnd),
})

/**
 * ドラッグイベントを監視し、カーソルの移動量や回転量を提供します。
 * @param target ドラッグイベントを監視する要素
 * @param ondown マウスダウン時のイベント。ドラッグを監視する場合はtrueを返してください
 * @param ondrag ドラッグ時のイベント
 * @param onup アップ時のイベント
 * @param center ドラッグによる回転の中心座標を返す関数。指定しないかこの関数がundefinedを返した場合、要素の中心を回転の中心とします
 * @param minDragMargin ドラッグイベントを発行するための最低移動量(px)。小さくするほど頻繁にイベントが発生します
 * @param maxFPS ドラッグイベントを発行する最大頻度の目安。大きくするほど頻繁にイベントが発生します
 * @returns
 */
export const useDragEvent = (
  target: HTMLElement,
  ondown: DownHandler,
  ondrag: DragHandler,
  onup: UpHandler,
  center?: () => Point | undefined,
  minDragMargin = 1,
  maxFPS = 60
): Canceler => {
  const state = {
    startPoint: new Point(),
    lastRawPoint: new Point(),
    isWatchMove: false,
    lastMs: Date.now(),
  }

  const getCenter = () => elementAnchor(target, center?.())

  const handlerDown = (ev: PointerEvent) => {
    if (!ev.isPrimary) return
    state.startPoint = state.lastRawPoint = new Point(ev.clientX, ev.clientY)
    state.isWatchMove = ondown(ev)
  }

  const handlerMove = (ev: PointerEvent) => {
    if (!ev.isPrimary) return
    if (!state.isWatchMove) return
    const p = new Point(ev.clientX, ev.clientY)
    const dist = p.sub(state.lastRawPoint).length
    const now = Date.now()
    const fps = 1000 / (now - state.lastMs)
    if (dist < minDragMargin) return
    if (fps > maxFPS) return
    if ((dist / minDragMargin) * (maxFPS / fps) < 3) return
    ondrag(ev, distForPoint(getCenter(), state.startPoint, p))
    state.lastRawPoint = p
    state.lastMs = now
  }

  const handlerUp = (ev: PointerEvent, isCommit = true) => {
    if (!ev.isPrimary) return
    if (!state.isWatchMove) return
    const p = new Point(ev.clientX, ev.clientY)
    onup(ev, distForPoint(getCenter(), state.startPoint, p), isCommit)
    state.isWatchMove = false
  }

  const handlerCancel = (ev: PointerEvent) => {
    handlerUp(ev, false)
  }

  target.addEventListener('pointerdown', handlerDown)
  target.addEventListener('pointermove', handlerMove)
  target.addEventListener('pointerup', handlerUp)
  target.addEventListener('pointercancel', handlerCancel)

  const canceler = () => {
    target.removeEventListener('pointerdown', handlerDown)
    target.removeEventListener('pointermove', handlerMove)
    target.removeEventListener('pointerup', handlerUp)
    target.removeEventListener('pointercancel', handlerCancel)
  }

  return canceler
}
