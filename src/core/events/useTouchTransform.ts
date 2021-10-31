import { Coordinate } from '../coords/Coordinate'
import { normalizeAngle } from '../coords/CoordUtil'
import { Point } from '../coords/Point'

const MIN_MULTITOUCH_DETECT_GAP_MS = 200

type TouchPoint = {
  identifier: number
  pagePoint: Point
}

type PointsSegment = {
  center: Point
  angle: number
  dist: number
}

export type TouchTransform = Pick<Coordinate, 'angle' | 'scale' | 'scroll'> & {
  center: Point
}

type TransformHandler = (tr: TouchTransform) => void

const points2segment = (ps: [Point, Point]): PointsSegment => {
  const [p1, p2] = ps
  const center = new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2)
  const angle = p1.sub(center).angle
  const dist = p2.sub(p1).length
  return { center, angle, dist }
}

const diffSegments = (ss: [PointsSegment, PointsSegment]): TouchTransform => {
  const [s1, s2] = ss
  return {
    scroll: s2.center.sub(s1.center),
    angle: normalizeAngle(s2.angle - s1.angle),
    scale: s2.dist / s1.dist,
    center: s2.center,
  }
}

export const useTouchTransform = (
  el: HTMLElement,
  onStart: () => void,
  onChange: TransformHandler,
  onEnd: () => void,
  minDragMargin = 1
) => {
  let touches: TouchPoint[] = []
  let basePoints: [Point, Point] | undefined
  let firstTouchMs: number = 0
  let isInMultiTouch: boolean = false

  // 1点目のタッチ時に呼び出す
  const onFirstTouch = () => {
    firstTouchMs = Date.now()
    isInMultiTouch = false
  }
  // 2点目のタッチ時に呼び出し、マルチタッチとして有効とみなすか判定する
  const isValidSecondTouch = (): boolean => {
    // 閾値時間内に2点目がタッチされたら有効
    return Date.now() - firstTouchMs <= MIN_MULTITOUCH_DETECT_GAP_MS
  }
  /** 現在のタッチの最初の2点を返します。タッチ数が1以下なら何も返しません */
  const first2Points = (): [Point, Point] | undefined => {
    if (touches.length < 2) return
    return [touches[0].pagePoint, touches[1].pagePoint]
  }

  el.ontouchstart = (ev) => {
    const ts = ev.changedTouches
    const initialCount = touches.length
    for (let index = 0; index < ts.length; index++) {
      const t = ts[index]
      touches.push({
        identifier: t.identifier,
        pagePoint: new Point(t.pageX, t.pageY),
      })
    }
    if (initialCount === 0) {
      onFirstTouch()
    }
    if (initialCount <= 1 && touches.length >= 2 && isValidSecondTouch()) {
      // start multi touches
      isInMultiTouch = true
      basePoints = first2Points()
      onStart()
    }
  }

  el.ontouchend = (ev) => {
    const ts = ev.changedTouches
    for (let index = 0; index < ts.length; index++) {
      touches = touches.filter((t) => t.identifier !== ts[index].identifier)
    }
    if (touches.length <= 1 && isInMultiTouch) {
      // end multi touches
      isInMultiTouch = false
      basePoints = undefined
      onEnd()
    }
  }

  el.ontouchmove = (ev) => {
    if (!isInMultiTouch) return
    let hasMoved = false
    for (let index = 0; index < ev.changedTouches.length; index++) {
      const ct = ev.changedTouches[index]
      const touch = touches.find((t) => t.identifier === ct.identifier)
      if (touch) {
        const pNew = new Point(ct.pageX, ct.pageY)
        if (touch.pagePoint.sub(pNew).length >= minDragMargin) {
          touch.pagePoint = pNew
          hasMoved = true
        }
      }
    }
    if (!hasMoved) return
    
    const currentPoints = first2Points()
    if (basePoints && currentPoints) {
      const [s1, s2] = [
        points2segment(basePoints),
        points2segment(currentPoints),
      ]
      const transformAmount = diffSegments([s1, s2])
      onChange(transformAmount)
    }
  }
}
