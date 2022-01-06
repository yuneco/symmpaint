import { HistoryState } from "./HistoryState";

export const getFirstSnapshotIndex = (state: HistoryState): number | undefined => {
  const index = state.stack.findIndex(ent => !!ent.snapshot)
  return index !== -1 ? index : undefined
}
