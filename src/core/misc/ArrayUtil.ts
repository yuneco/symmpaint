/**
 * 2つの配列の全ての要素についてa1[n] === a2[n]が成立する場合trueを返します
 */
export const isSameArray = <T>(a1: T[], a2: T[]) => {
  if (a1.length !== a2.length) return false
  for (let index = 0; index < a1.length; index++) {
    if (a1[index] !== a2[index]) return false
  }
  return true
}
