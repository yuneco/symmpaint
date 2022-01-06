export const logMatrix = (mx: DOMMatrix) => {
  const [a, b, c, d, e, f] = [mx.a, mx.b, mx.c, mx.d, mx.e, mx.f].map((v) => Number(v.toFixed(1)))
  console.table([
    [a, c, e],
    [b, d, f],
  ])
}

export const logP = (p: { x: number; y: number }) => {
  const [x, y] = [p.x, p.y].map((v) => Number(v.toFixed(1)))
  console.log([x, y])
}
