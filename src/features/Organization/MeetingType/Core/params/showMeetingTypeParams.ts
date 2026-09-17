import type Params from '@/base/core/params/params'

export default class ShowMeetingTypeParams implements Params {
  id: number

  constructor(id: number) {
    this.id = id
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {}
    data['meeting_type_id'] = this.id
    return data
  }
}
