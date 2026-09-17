import type Params from '@/base/core/params/params'

export default class ShowMangementChangeTopicTypeParams implements Params {
  id: number

  constructor(id: number) {
    this.id = id
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {}
    data['changement_topic_id'] = this.id
    return data
  }
}
