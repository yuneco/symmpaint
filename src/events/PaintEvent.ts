/** 汎用のイベント機構 */
export class PaintEvent<T> {
  private readonly listeners: ((param: T) => void)[] = []

  /** イベントを発火します */
  fire(param: T) {
    this.listeners.forEach(l => l(param))
  }

  /** イベントリスナーを登録します */
  listen(fn: (param: T) => void) {
    if (this.listeners.includes(fn)) return
    this.listeners.push(fn)
  }

  /** 全てのイベントリスナーを削除します */
  clear() {
    this.listeners.length = 0
  }
}
