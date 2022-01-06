const DEBUG_AREA_SELECTOR = '#debug .history .snaps'
export const clearDebugBox = () => {
  const debugBox = document.querySelector(DEBUG_AREA_SELECTOR)
  if (debugBox) {
    debugBox.innerHTML = ''
  }
}

export const addToDebugBox = (canvas: HTMLCanvasElement) => {
  const debugBox = document.querySelector(DEBUG_AREA_SELECTOR)
  if (debugBox) {
    const scale = 120 / Math.max(canvas.width, canvas.height)
    canvas.style.width = `${canvas.width * scale}px`
    canvas.style.height = `${canvas.height * scale}px`
    debugBox.appendChild(canvas)
    canvas.scrollIntoView()
  }
}

export const removeFromDebugBox = (canvas: HTMLCanvasElement) => {
  const debugBox = document.querySelector(DEBUG_AREA_SELECTOR)
  if (debugBox) {
    debugBox.removeChild(canvas)
  }
}
