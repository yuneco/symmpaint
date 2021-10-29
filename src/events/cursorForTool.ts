import { CanvasToolName } from "../canvas/CanvasToolName"

/** 操作に対応するCSSカーソルを返します */
export const cursorForTool = (tool: CanvasToolName) => {
  return (
    {
      draw: 'crosshair',
      scroll: 'move',
      zoomup: 'zoom-in',
      zoomdown: 'zoom-out',
      rotate: 'grab',
      'draw:line': 'crosshair',
      'draw:stamp': 'crosshair',
    }[tool] ?? 'default'
  )
}
