import type Params from '@/base/core/params/params'

export default class PermissionRolrParamsParams implements Params {
  name: string

  constructor(name: string) {
    this.name = name
  }

  toMap(): Record<string, number | string> {
    const data: Record<string, number | string> = {}
    data['name'] = this.name
    return data
  }
}
