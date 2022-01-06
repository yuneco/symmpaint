import { hasBackHistory, hasForwardHistory } from "./hasHistory";
import { HistoryState } from "./HistoryState";

export const goBackHistory = (state: HistoryState): HistoryState => {
  if (!hasBackHistory(state)) {
    console.log('no back history')
    return state
  }
  return {
    currentIndex: state.currentIndex - 1,
    stack: [...state.stack]
  }
}

export const goForwardHistory = (state: HistoryState): HistoryState => {
  if (!hasForwardHistory(state)) {
    console.log('no forward history')
    return state
  }
  return {
    currentIndex: state.currentIndex + 1,
    stack: [...state.stack]
  }
}
