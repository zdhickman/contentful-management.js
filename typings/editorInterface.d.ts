import { MetaSys, MetaSysProps } from './generated/common-types'

export interface Control {
  fieldId: string
  widgetId: string
  widgetNamespace: string
}

export interface EditorInterface extends MetaSys<MetaSysProps> {
  controls: Control[]
  getControlForField(id: string): null | Control
  update(): Promise<EditorInterface>
}
