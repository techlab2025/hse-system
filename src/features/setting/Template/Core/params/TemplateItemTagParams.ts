import type Params from '@/base/core/params/params'

export default class TemplateItemTagParams implements Params {
  public id: number

  constructor(id: number) {
    this.id = id
  }

  toMap(): Record<string, string | number | number[] | null> {
    const data: Record<string, string | number | number[] | null> = {}
    if (this.id) data['template_id'] = this.id
    return data
  }
}
