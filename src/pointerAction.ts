export type PointerAction = 'draw' | 'scroll' | 'zoomup' | 'zoomdown' | 'rotate'

export const actionCursor = (action: PointerAction) => {
  return (
    {
      draw: 'crosshair',
      scroll: 'move',
      zoomup: 'zoom-in',
      zoomdown: 'zoom-out',
      rotate: 'grab'
    }[action] ?? 'default'
  )
}

export const keysAction = (keys: string[]): PointerAction => {
  const keySp = keys.includes(' ')
  const keyOpt = keys.includes('Alt')
  const keyCmd = keys.includes('Meta')
  if (keySp && keyCmd && keyOpt) return 'zoomdown'
  if (keySp && keyCmd) return 'zoomup'
  if (keySp && keyOpt) return 'rotate'
  if (keySp) return 'scroll'
  return 'draw'
}
