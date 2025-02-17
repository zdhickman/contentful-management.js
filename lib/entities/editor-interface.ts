import copy from 'fast-copy'
import { freezeSys, toPlainObject } from 'contentful-sdk-core'
import enhanceWithMethods from '../enhance-with-methods'
import { MetaSysProps, MetaLinkProps, DefaultElements, MakeRequest } from '../common-types'
import { wrapCollection } from '../common-utils'
import { DefinedParameters } from './widget-parameters'

interface WidgetConfig {
  /**
   * Type of the widget used
   */
  widgetNamespace?: string
  /**
   * ID of the widget used
   */
  widgetId?: string
  /**
   * Instance parameter values
   */
  settings?: DefinedParameters
}

export interface Control extends WidgetConfig {
  /**
   * ID of the customized field
   */
  fieldId: string
}

export interface GroupControl extends WidgetConfig {
  /**
   * ID of the customized group
   */
  groupId: string
}

export interface EditorLayoutItem {
  groupId: string
  name: string
  items: Array<EditorLayoutItem | FieldItem>
  default?: boolean
}

export interface FieldItem {
  fieldId: string
}

export interface Editor {
  /**
   * Type of the widget used
   */
  widgetNamespace: string
  /**
   * ID of the widget used
   */
  widgetId: string
  /**
   * Widget will be enabled if disabled property is missing
   */
  disabled?: boolean
  /**
   * Instance parameter values
   */
  settings?: DefinedParameters
}

export interface SidebarItem {
  /**
   * Type of the widget used
   */
  widgetNamespace: string
  /**
   * ID of the widget used
   */
  widgetId: string
  /**
   * Widget will be enabled if disabled property is missing
   */
  disabled?: boolean
  /**
   * Instance parameter values
   */
  settings?: DefinedParameters
}

export type EditorInterfaceProps = {
  sys: MetaSysProps & {
    space: { sys: MetaLinkProps }
    environment: { sys: MetaLinkProps }
    contentType: { sys: MetaLinkProps }
  }
  /**
   * Array of fields and their associated widgetId
   */
  controls?: Control[]
  /**
   * Array of groups and their associated widgetId
   */
  groupControls?: GroupControl[]
  /**
   * Array of editors. Defaults will be used if property is missing.
   */
  editors?: Editor[]
  /**
   * Legacy singular editor override
   */
  editor?: Editor
  /**
   * Array of editor layout groups
   */
  editorLayout?: EditorLayoutItem[]
  /**
   * Array of sidebar widgets. Defaults will be used if property is missing.
   */
  sidebar?: SidebarItem[]
}

export interface EditorInterface
  extends EditorInterfaceProps,
    DefaultElements<EditorInterfaceProps> {
  /**
   * Gets a control for a specific field
   * @return control object for specific field
   * ```javascript
   * const contentful = require('contentful-management')
   *
   * const client = contentful.createClient({
   *   accessToken: '<content_management_api_key>'
   * })
   *
   * client.getSpace('<space_id>')
   * .then((space) => space.getEnvironment('<environment_id>'))
   * .then((environment) => environment.getContentType('<contentType_id>'))
   * .then((contentType) => contentType.getEditorInterface())
   * .then((editorInterface) => {
   *  control = editorInterface.getControlForField('<field-id>')
   *  console.log(control)
   * })
   * .catch(console.error)
   * ```
   */
  getControlForField(id: string): null | Control
  /**
   * Sends an update to the server with any changes made to the object's properties
   * @return Object returned from the server with updated changes.
   * ```javascript
   * const contentful = require('contentful-management')
   *
   * const client = contentful.createClient({
   *   accessToken: '<content_management_api_key>'
   * })
   *
   * client.getSpace('<space_id>')
   * .then((space) => space.getEnvironment('<environment_id>'))
   * .then((environment) => environment.getContentType('<contentType_id>'))
   * .then((contentType) => contentType.getEditorInterface())
   * .then((editorInterface) => {
   *  editorInterface.controls[0] = { "fieldId": "title", "widgetId": "singleLine"}
   *  editorInterface.editors = [
   *    { "widgetId": "custom-widget", "widgetNamespace": "app" }
   *  ]
   *  return editorInterface.update()
   * })
   * .catch(console.error)
   * ```
   */
  update(): Promise<EditorInterface>
}

function createEditorInterfaceApi(makeRequest: MakeRequest) {
  return {
    update: function () {
      const self = this as EditorInterface
      const raw = self.toPlainObject()
      return makeRequest({
        entityType: 'EditorInterface',
        action: 'update',
        params: {
          spaceId: self.sys.space.sys.id,
          environmentId: self.sys.environment.sys.id,
          contentTypeId: self.sys.contentType.sys.id,
        },
        payload: raw,
      }).then((response) => wrapEditorInterface(makeRequest, response))
    },

    getControlForField: function (fieldId: string) {
      const self = this as EditorInterface
      const result = (self.controls || []).filter((control) => {
        return control.fieldId === fieldId
      })
      return result && result.length > 0 ? result[0] : null
    },
  }
}

/**
 * @private
 */
export function wrapEditorInterface(
  makeRequest: MakeRequest,
  data: EditorInterfaceProps
): EditorInterface {
  const editorInterface = toPlainObject(copy(data))
  const editorInterfaceWithMethods = enhanceWithMethods(
    editorInterface,
    createEditorInterfaceApi(makeRequest)
  )
  return freezeSys(editorInterfaceWithMethods)
}

/**
 * @private
 */
export const wrapEditorInterfaceCollection = wrapCollection(wrapEditorInterface)
