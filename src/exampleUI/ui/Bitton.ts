import './button.scss'

export class Button {
  readonly el: HTMLButtonElement
  constructor(caption: string) {
    const el = (this.el = document.createElement('button'))
    el.className = 'Button'
    el.textContent = caption
  }

  addEventListener(...params: Parameters<HTMLButtonElement['addEventListener']>) {
    return this.el.addEventListener(...params)
  }
  removeEventListener(...params: Parameters<HTMLButtonElement['removeEventListener']>) {
    return this.el.removeEventListener(...params)
  }
}
