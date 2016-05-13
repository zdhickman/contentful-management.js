import {assign} from 'lodash/object'
import {cloneDeep} from 'lodash/lang'

const linkMock = {
  id: 'linkid',
  type: 'Link',
  linkType: 'linkType'
}

const sysMock = {
  type: 'Type',
  id: 'id',
  space: cloneDeep(linkMock),
  createdAt: 'createdatdate',
  updatedAt: 'updatedatdate',
  revision: 1
}

const spaceMock = {
  sys: assign(cloneDeep(sysMock), {
    type: 'Space'
  }),
  name: 'name',
  locales: [ 'en-US' ]
}

const contentTypeMock = {
  sys: assign(cloneDeep(sysMock), {
    type: 'ContentType'
  }),
  name: 'name',
  description: 'desc',
  displayField: 'displayfield',
  fields: [
    {
      id: 'fieldid',
      name: 'fieldname',
      type: 'Text',
      localized: true,
      required: false
    }
  ]
}

const entryMock = {
  sys: assign(cloneDeep(sysMock), {
    type: 'Entry',
    contentType: assign(cloneDeep(linkMock), {linkType: 'ContentType'}),
    locale: 'locale'
  }),
  fields: {
    field1: 'str'
  }
}

const assetMock = {
  sys: assign(cloneDeep(sysMock), {
    type: 'Asset',
    locale: 'locale'
  }),
  fields: {
    field1: 'str'
  }
}

const localeMock = {
  sys: assign(cloneDeep(sysMock), {
    type: 'Locale'
  }),
  name: 'English',
  code: 'en',
  contentDeliveryApi: true,
  contentManagementApi: true,
  default: true
}

const errorMock = {
  config: {
    url: 'requesturl',
    headers: {}
  },
  data: {},
  status: 404,
  statusText: 'Not Found'
}

const mocks = {
  link: linkMock,
  sys: sysMock,
  contentType: contentTypeMock,
  entry: entryMock,
  asset: assetMock,
  locale: localeMock,
  error: errorMock
}

function cloneMock (name) {
  return cloneDeep(mocks[name])
}

function mockCollection (entityMock) {
  return {
    total: 1,
    skip: 0,
    limit: 100,
    items: [entityMock]
  }
}

export {
  linkMock,
  sysMock,
  spaceMock,
  contentTypeMock,
  entryMock,
  assetMock,
  localeMock,
  errorMock,
  cloneMock,
  mockCollection
}
