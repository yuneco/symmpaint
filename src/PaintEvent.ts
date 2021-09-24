export class PaintEvent<T> {
  private readonly listeners: ((param: T) => void)[] = []

  fire(param: T) {
    this.listeners.forEach(l => l(param))
  }

  listen(fn: (param: T) => void) {
    if (this.listeners.includes(fn)) return
    this.listeners.push(fn)
  }
}
