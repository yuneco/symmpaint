import { PaintEvent } from '../events/PaintEvent'

/**
 * 格納数上限付きのスタックです。
 * あふれた要素は削除されます。
 * 削除時のイベントハンドラを設定できます。
 */
export class LimittedStack<T> {
  readonly maxItems: number
  private readonly items: T[] = []
  private readonly onOverflow = new PaintEvent<T>()
  constructor(max = 10) {
    this.maxItems = max
  }

  get length() {
    return this.items.length
  }

  clear() {
    this.items.length = 0
  }

  push(item: T) {
    this.items.push(item)
    if (this.items.length <= this.maxItems) return
    const removed = this.items.shift()
    if (removed) this.onOverflow.fire(removed)
  }

  pop(): T | undefined {
    return this.items.pop()
  }

  peek(offset = 0): T | undefined {
    return this.items[this.items.length - 1 + offset]
  }

  getItems(): T[] {
    return [...this.items]
  }

  listenOverflow(...params: Parameters<PaintEvent<T>['listen']>) {
    this.onOverflow.listen(...params)
  }
}
