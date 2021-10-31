export const ZOOM_MIN = 0.2
export const ZOOM_MAX = 4.0
export const ZOOM_TABLE = [
  0,
  ZOOM_MIN,
  0.33,
  0.5,
  0.67,
  0.75,
  1,
  1.5,
  2,
  2.5,
  3,
  3.5,
  ZOOM_MAX,
  Infinity,
]

export const getNextZoom = (current: number, isUp: boolean) => {
  const table = isUp ? ZOOM_TABLE : [...ZOOM_TABLE].reverse()
  const index = table.findIndex((v) => (isUp ? v > current : v < current))
  const scale = table[index] ?? 0
  return Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, scale))
}
