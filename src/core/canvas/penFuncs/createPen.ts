import { Coordinate } from '../..'
import { Pen } from '../Pen'

const relativeChildAnchor = (anchor: [Coordinate, Coordinate]): Coordinate => {
  const angleP2C = anchor[1].scroll.sub(anchor[0].scroll).angle
  return new Coordinate({
    scroll: anchor[1].scroll.sub(anchor[0].scroll).rotate(-anchor[0].angle),
    angle: angleP2C + anchor[1].angle,
  })
}

export const createPen = (
  count: [number, number],
  anchor: [Coordinate, Coordinate],
  isKaleido: [boolean, boolean]
) => {
  const root = new Pen()
  const [pKaleido, cKaleido] = isKaleido
  const [pCount, cCount] = [count[0] * (pKaleido ? 2 : 1), count[1] * (cKaleido ? 2 : 1)]

  // 最初のペンと最後のペンの真ん中が0度になるよう、ルートの軸を360/親ペン数/2だけずらす
  const pAngleOffset = 360 / pCount / 2
  const cAngleOffset = 360 / cCount / 2
  const pAnchor = anchor[0].clone({ angle: anchor[0].angle + pAngleOffset })
  const cAnchor = anchor[1]
  // ずらした軸を基準に子アンカーの相対位置を求める
  const relativeAnchor = relativeChildAnchor([pAnchor, cAnchor])

  root.coord = pAnchor
  for (let penNo = 0; penNo < pCount; penNo++) {
    const isFlip = pKaleido && penNo % 2 !== 0
    const child = root.addChildPen(new Coordinate({ angle: (penNo / pCount) * 360, flipY: isFlip }))
    for (let penNoCh = 0; penNoCh < cCount; penNoCh++) {
      const isFlipCh = cKaleido && penNoCh % 2 !== 0
      child
        .addChildPen(
          new Coordinate({
            scroll: relativeAnchor.scroll,
            angle: relativeAnchor.angle + (cAngleOffset - pAngleOffset) - anchor[0].angle,
          })
        )
        .addChildPen(
          new Coordinate({
            angle: (penNoCh / cCount) * 360,
            flipY: isFlipCh,
          })
        )
    }
  }

  return root
}
