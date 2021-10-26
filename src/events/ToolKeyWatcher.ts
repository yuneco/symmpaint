import { KeyPressWatcher } from './KeyPressWatcher'
import { PaintEvent } from './PaintEvent'
import { toolForKeys } from './toolForKeys'
import { CanvasToolName } from '../controls/CanvasToolName'

export class ToolKeyWatcher {
  private readonly keyWatcher: KeyPressWatcher
  private tool?: CanvasToolName
  private readonly onChange = new PaintEvent<CanvasToolName>()
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

  listenChange(...params: Parameters<typeof this.onChange.listen>) {
    this.onChange.listen(...params)
  }
}
