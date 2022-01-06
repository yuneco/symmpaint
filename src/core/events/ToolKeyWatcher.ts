import { KeyPressWatcher } from './KeyPressWatcher'
import { PaintEvent } from './PaintEvent'
import { toolForKeys } from './toolForKeys'
import { CanvasToolName } from '../canvas/CanvasToolName'

type ChangeEvent = PaintEvent<CanvasToolName>

export class ToolKeyWatcher {
  private readonly keyWatcher: KeyPressWatcher
  private tool?: CanvasToolName
  private readonly onChange: ChangeEvent = new PaintEvent()
  constructor() {
    // キー状態の変更監視
    this.keyWatcher = new KeyPressWatcher()
    this.keyWatcher.listen(() => {
      const toolNew = toolForKeys(this.keyWatcher.keys)
      if (this.tool !== toolNew) {
        this.tool = toolNew
        this.onChange.fire(toolNew)
      }
    })
  }

  listenChange(...params: Parameters<ChangeEvent['listen']>) {
    this.onChange.listen(...params)
  }
}
