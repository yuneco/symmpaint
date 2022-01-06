import { AbstractCanvas } from '../AbstractCanvas'
import { StrokeRecord } from '../StrokeRecord'

export type HistoryEntry = {
  readonly id: number
  readonly stroke: StrokeRecord
  snapshot?: AbstractCanvas
}
