import { notNull } from '../../misc/notNull'
import { AbstractCanvas } from '../AbstractCanvas'
import { StrokeRecord } from '../StrokeRecord'
import { getSnapshotIndexFor } from './getSnapshotFor'
import { HistoryState } from './HistoryState'

export const pushHistory = (
  state: HistoryState,
  stroke: StrokeRecord,
  createSnap: () => AbstractCanvas,
  maxSnaps = 10,
  snapInterval = 10
): HistoryState => {
  const backStack = [...state.stack]
  backStack.length = state.currentIndex + 1 // discard forward
  backStack.push({ stroke, id: backStack.length })

  const stateNew: HistoryState = {
    stack: backStack,
    currentIndex: backStack.length - 1,
  }

  const lastSnapIndex = getSnapshotIndexFor(stateNew)
  if (lastSnapIndex === undefined || stateNew.currentIndex - lastSnapIndex >= snapInterval) {
    // add new snapshot
    stateNew.stack[stateNew.currentIndex].snapshot = createSnap()
  }

  // delete overflown snaps
  const snaps = stateNew.stack
    .map((ent, index) => (ent.snapshot ? index : undefined))
    .filter(notNull)
  if (snaps.length > maxSnaps) {
    snaps.length = snaps.length - maxSnaps
    snaps.forEach((snapIndex) => (stateNew.stack[snapIndex].snapshot = undefined))
  }

  return stateNew
}
