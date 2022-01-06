import { AbstractCanvas } from '../AbstractCanvas'
import { HistoryState } from './HistoryState'

export const getSnapshotIndexFor = (state: HistoryState, indexFor?: number): number | undefined => {
  for (let index = indexFor ?? state.currentIndex; index >= 0; index--) {
    if (state.stack[index]?.snapshot) return index
  }
  return undefined
}

export const getSnapshotFor = (
  state: HistoryState,
  indexFor?: number
): AbstractCanvas | undefined => {
  const index = getSnapshotIndexFor(state, indexFor)
  if (index === undefined) return undefined
  return state.stack[index].snapshot
}
