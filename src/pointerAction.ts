export type PointerAction = 'draw' | 'scroll' | 'zoomup' | 'zoomdown'

export const actionCursor = (action: PointerAction) => {
  return (
    {
      draw: 'crosshair',
      scroll: 'move',
      zoomup: 'zoom-in',
      zoomdown: 'zoom-out',
    }[action] ?? 'default'
  )
}

export const keysAction = (keys: string[]): PointerAction => {
  const keySp = keys.includes(' ')
  const keyOpt = keys.includes('Alt')
  const keyCmd = keys.includes('Meta')
  if (keySp && keyCmd && keyOpt) return 'zoomdown'
  if (keySp && keyCmd) return 'zoomup'
  if (keySp) return 'scroll'
  return 'draw'
}
