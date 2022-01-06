import { HistoryEntry } from './HistoryEntry'

export type HistoryState = Readonly<{
  stack: Readonly<HistoryEntry[]>
  currentIndex: number
}>
