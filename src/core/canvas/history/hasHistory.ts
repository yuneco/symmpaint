import { getFirstSnapshotIndex } from './getFirstSnapshotIndex'
import { HistoryEntry } from './HistoryEntry'
import { HistoryState } from './HistoryState'

export const hasBackHistory = (state: HistoryState): boolean => {
  const first = getFirstSnapshotIndex(state)
  return first !== undefined && first < state.currentIndex
}

export const hasForwardHistory = (state: HistoryState): boolean => {
  return state.currentIndex < state.stack.length - 1
}

export const getBackHistory = (state: HistoryState): HistoryEntry[] => {
  return state.stack.slice(0, state.currentIndex)
}

export const getForwardHistory = (state: HistoryState): HistoryEntry[] => {
  return state.stack.slice(state.currentIndex + 1)
}
