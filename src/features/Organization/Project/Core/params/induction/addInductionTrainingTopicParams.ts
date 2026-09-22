import type Params from '@/base/core/params/params'

export default class InductionTrainingTopicParams implements Params {
  constructor(public  training_Topic_id: number) {}

  toMap(): Record<string, number> {
    return {
      training_Topic_id: this.training_Topic_id,
    }
  }
}