import type Params from '@/base/core/params/params'

export default class DeleteIncidentCategoryParams implements Params {
  constructor(public id: number) {
    this.id = id
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {}
    data['incident_category_id'] = this.id
    return data
  }
}
