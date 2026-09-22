import type Params from '@/base/core/params/params'
export default class ShowTraningTopicParams implements Params {
  constructor(public id: number) {}
  toMap(): Record<string, number> { return { traning_topic_id: this.id } }
}
