import TraningTopicModel from '@/features/Organization/TraningTopic/Data/models/TraningTopicModel'

type InductionTrainingTopicResponse = {
  id?: number
  title?: string
  training_topic_id?: number
  training_Topic_id?: number
  training_topic?: InductionTrainingTopicResponse
}

export default class InductionTrainingTopicModel extends TraningTopicModel {
  public inductionTrainingTopicId: number
  public trainingTopicId: number

  constructor(id: number, title: string, inductionTrainingTopicId: number, trainingTopicId: number) {
    super(id, title)
    this.inductionTrainingTopicId = inductionTrainingTopicId
    this.trainingTopicId = trainingTopicId
  }

  static fromMap(data: Record<string, unknown>): InductionTrainingTopicModel {
    const item = data as InductionTrainingTopicResponse
    const topic = item.training_topic ?? item
    const trainingTopicId = Number(topic.id ?? item.training_topic_id ?? item.training_Topic_id ?? item.id ?? 0)

    return new InductionTrainingTopicModel(
      trainingTopicId,
      topic.title ?? item.title ?? 'Training Topic #' + trainingTopicId,
      Number(item.id ?? 0),
      trainingTopicId,
    )
  }
}
