import { Coordinate } from '../coords/Coordinate'
import { normalizeAngle } from '../coords/CoordUtil'
import { Point } from '../coords/Point'

/** マルチタッチの有効判定で、1点目と2点目のタッチ時間差の最大許容値(ms) */
const MAX_MULTITOUCH_DETECT_GAP_MS = 200

/** 2本指タップの検出で、押下状態の最大許容時間（これを超えると2本指タップとは看做さない） */
const MAX_TWO_FINGER_TAP_DOWN_MS = 300
const MAX_TWO_FINGER_TAP_MOVE_PX = 10

/** タッチイベントの識別IDと座標 */
type TouchPoint = {
  identifier: number
  pagePoint: Point
}

/** 2点間の距離や角度を保持する型 */
type PointsSegment = {
  /** 1点の中心座標 */
  center: Point
  /** 2点の線分の角度 */
  angle: number
  /** 2点の距離 */
  dist: number
}

/** タッチ操作でスクロール・ズーム・回転を行った際の操作量 */
export type TouchTransform = Pick<Coordinate, 'angle' | 'scale' | 'scroll'> & {
  /** 操作の中心座標 */
  center: Point
}

/** タッチ操作でスクロール・ズーム・回転を行った際のイベントハンドラ関数の型 */
type TransformHandler = (tr: TouchTransform, touchCount: number) => void
type EventHandlers = {
  /** マルチタッチが開始された */
  onStart: () => void
  /** マルチタッチで変形操作（スクロール・ズーム・回転）が行われた */
  onTransform: TransformHandler
  /** マルチタッチが終了した */
  onEnd: () => void
  /** 2本指タップが発生した */
  onTwoFingerTap: () => void
  /** 3本指タップが発生した */
  onThreeFingerTap: () => void
}

/** 2点から線分の情報を得ます */
const points2segment = (ps: [Point, Point]): PointsSegment => {
  const [p1, p2] = ps
  const center = new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2)
  const angle = p1.sub(center).angle
  const dist = p2.sub(p1).length
  return { center, angle, dist }
}

/** 線分1から線分2に変形する操作を求めます */
const diffSegments = (ss: [PointsSegment, PointsSegment]): TouchTransform => {
  const [s1, s2] = ss
  return {
    scroll: s2.center.sub(s1.center),
    angle: normalizeAngle(s2.angle - s1.angle),
    scale: s2.dist / s1.dist,
    center: s2.center,
  }
}

/** TouchListをArrayに変換するユーティリティ */
const touchList2Array = (list: TouchList): Touch[] => {
  const arr: Touch[] = []
  for (let index = 0; index < list.length; index++) {
    arr.push(list[index])
  }
  return arr
}

/**
 * マルチタッチで移動・回転・ズームを行うためのイベントを提供します
 * @param el 対象要素
 * @param handlers イベントハンドラ
 * @param minDragMargin タッチ時の座標移動を検出する最低移動量(px)
 * @returns elに対するイベントハンドラを削除する関数
 */
export const useTouchTransform = (
  el: HTMLElement,
  handlers: Partial<EventHandlers>,
  minDragMargin = 1
) => {
  let touches: TouchPoint[] = []
  let basePoints: [Point, Point] | undefined
  let firstTouchMs = 0
  let isInMultiTouch = false
  let maxTouchCount = 0
  let maxMove = 0

  // 1点目のタッチ時に呼び出す
  const onFirstTouch = () => {
    firstTouchMs = Date.now()
    isInMultiTouch = false
    maxTouchCount = 0
    maxMove = 0
  }
  // 2点目のタッチ時に呼び出し、マルチタッチとして有効とみなすか判定する
  const isValidSecondTouch = (): boolean => {
    // 閾値時間内に2点目がタッチされたら有効
    return Date.now() - firstTouchMs <= MAX_MULTITOUCH_DETECT_GAP_MS
  }
  /** 現在のタッチの最初の2点を返します。タッチ数が1以下なら何も返しません */
  const first2Points = (): [Point, Point] | undefined => {
    if (touches.length < 2) return
    return [touches[0].pagePoint, touches[1].pagePoint]
  }

  /** タッチリストから指定のタッチを削除します */
  const removeTouches = (list: TouchList) => {
    const delIds = touchList2Array(list).map((t) => t.identifier)
    touches = touches.filter((t) => !delIds.includes(t.identifier))
  }

  /** タッチリストに指定のタッチを追加します */
  const addTouches = (list: TouchList) => {
    // 削除漏れがあるとID重複になるので、先に削除
    removeTouches(list)
    const ts: TouchPoint[] = touchList2Array(list).map((t) => ({
      identifier: t.identifier,
      pagePoint: new Point(t.clientX, t.clientY),
    }))
    touches = [...touches, ...ts]
  }

  /** タッチリストのタッチ座標を更新します */
  const updateTouches = (list: TouchList): boolean => {
    const targets = touchList2Array(list)
    let hasChaned = false
    targets.forEach((target) => {
      const touch = touches.find((t) => t.identifier === target.identifier)
      if (!touch) return
      const pNew = new Point(target.clientX, target.clientY)
      // 閾値未満なら無視する
      if (touch.pagePoint.sub(pNew).length <= minDragMargin) return
      touch.pagePoint = pNew
      hasChaned = true
    })
    return hasChaned
  }

  const ontouchstart = (ev: TouchEvent) => {
    const initialCount = touches.length
    addTouches(ev.changedTouches)
    if (initialCount === 0) {
      // 1点目のタッチ
      onFirstTouch()
    }
    if (initialCount <= 1 && touches.length >= 2 && isValidSecondTouch()) {
      // 初めて2点以上になった = マルチタッチ開始
      isInMultiTouch = true
      basePoints = first2Points()
      handlers.onStart?.()
    }
    maxTouchCount = Math.max(maxTouchCount, touches.length)
  }

  const ontouchend = (ev: TouchEvent) => {
    removeTouches(ev.changedTouches)
    if (touches.length <= 1 && isInMultiTouch) {
      // マルチタッチ開始後にタッチ数が1未満になった = マルチタッチ終了
      isInMultiTouch = false
      basePoints = undefined
      handlers.onEnd?.()
      // 2,3本指タップの判定
      if (
        Date.now() - firstTouchMs < MAX_TWO_FINGER_TAP_DOWN_MS &&
        maxMove <= MAX_TWO_FINGER_TAP_MOVE_PX
      ) {
        if (maxTouchCount === 2) handlers.onTwoFingerTap?.()
        if (maxTouchCount === 3) handlers.onThreeFingerTap?.()
      }
    }
  }

  const ontouchmove = (ev: TouchEvent) => {
    if (!isInMultiTouch) return

    const hasMoved = updateTouches(ev.changedTouches)
    if (!hasMoved) return // 変化なしなら終了

    const currentPoints = first2Points()
    if (basePoints && currentPoints) {
      const [s1, s2] = [points2segment(basePoints), points2segment(currentPoints)]
      const transformAmount = diffSegments([s1, s2])
      maxMove = Math.max(maxMove, transformAmount.scroll.length)
      handlers.onTransform?.(transformAmount, maxTouchCount)
    }
  }

  el.addEventListener('touchstart', ontouchstart)
  el.addEventListener('touchend', ontouchend)
  el.addEventListener('touchcancel', ontouchend)
  el.addEventListener('touchmove', ontouchmove)

  const canceler = () => {
    el.removeEventListener('touchstart', ontouchstart)
    el.removeEventListener('touchend', ontouchend)
    el.removeEventListener('touchcancel', ontouchend)
    el.removeEventListener('touchmove', ontouchmove)
  }

  return canceler
}
