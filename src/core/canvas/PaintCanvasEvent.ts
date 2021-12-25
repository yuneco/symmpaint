import { Coordinate, Point } from ".."
import { PaintEvent } from "../events/PaintEvent"

/** 移動の対象 */
export type TransformTarget = 'canvas' | 'anchor'

export type PaintCanvasEvent = {
  requestChangeZoom: PaintEvent<number>
  requestScrollTo:PaintEvent<{
    point: Point
    target: TransformTarget
  }>
  requestRotateTo: PaintEvent<{
    angle: number
    target: TransformTarget
  }>
  requestUndo: PaintEvent<void>
  requestAnchorTransform: PaintEvent<Coordinate>
  requestAnchorReset: PaintEvent<void>
  strokeStart: PaintEvent<void>
  strokeEnd: PaintEvent<boolean>
}
type EventParm<T> = T extends PaintEvent<infer U> ? U : never
export type CanvasEventParm<K extends keyof PaintCanvasEvent> = EventParm<PaintCanvasEvent[K]>
