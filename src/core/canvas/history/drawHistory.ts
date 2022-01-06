import { AbstractCanvas } from "../AbstractCanvas"
import { replayStrokes } from "../strokeFuncs/replayStrokes"
import { getSnapshotIndexFor } from "./getSnapshotFor"
import { HistoryState } from "./HistoryState"

export const drawHistory = (state: HistoryState, output: AbstractCanvas, indexOf?: number) => {
  const goalIndex = indexOf ?? state.currentIndex
  const snapIndex = getSnapshotIndexFor(state, goalIndex)
  if (snapIndex === undefined) {
    console.warn('Failed to draw history: no snapshot for index', goalIndex)
    return
  }
  const snap = state.stack[snapIndex].snapshot
  if (snap) {
    output.ctx.save()
    output.ctx.resetTransform()
    output.ctx.drawImage(snap.el, 0, 0)
    output.ctx.restore()
  }

  const strokes = state.stack.slice(snapIndex + 1, goalIndex + 1).map(ent => ent.stroke)
  const tempCanvas = new AbstractCanvas(output.width, output.height)
  replayStrokes(output, tempCanvas, strokes)
  output.ctx.restore()
}
