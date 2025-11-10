import type Params from '@/base/core/params/params'

export default class ProjectCustomLocationParams implements Params {
  id: number
  type: number[]

  constructor(id: number, type: number[]) {
    this.id = id
    this.type = type
  }

  toMap(): Record<string, number | number[]> {
    const data: Record<string, number | number[]> = {}
    data['project_id'] = this.id
    data['type'] = this.type
    return data
  }
}
