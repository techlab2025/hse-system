import TraningTopicModel from '@/features/Organization/TraningTopic/Data/models/TraningTopicModel'

type LocaleTitle = { locale?: string; title?: string }
type InductionTrainingTopicResponse = {
  id?: number
  title?: string
  titles?: LocaleTitle[]
  training_topic_id?: number | InductionTrainingTopicResponse
  training_Topic_id?: number | InductionTrainingTopicResponse
  training_topic?: InductionTrainingTopicResponse
}

export default class InductionTrainingTopicModel extends TraningTopicModel {
  public inductionTrainingTopicId: number
  public trainingTopicId: number
  public displayTitle: string

  constructor(id: number, title: string, inductionTrainingTopicId: number, trainingTopicId: number) {
    super(id, title)
    this.inductionTrainingTopicId = inductionTrainingTopicId
    this.trainingTopicId = trainingTopicId
    this.displayTitle = title || (trainingTopicId ? 'Training Topic #' + trainingTopicId : '-')
  }

  static fromMap(data: Record<string, unknown>): InductionTrainingTopicModel {
    const item = data as InductionTrainingTopicResponse
    const topic =
      typeof item.training_topic_id === 'object' && item.training_topic_id
        ? item.training_topic_id
        : typeof item.training_Topic_id === 'object' && item.training_Topic_id
          ? item.training_Topic_id
          : item.training_topic ?? item
    const locale = (typeof localStorage !== 'undefined' && localStorage.getItem('lang')) || 'en'
    const trainingTopicId = Number(
      topic.id ??
        (typeof item.training_topic_id === 'number' ? item.training_topic_id : null) ??
        (typeof item.training_Topic_id === 'number' ? item.training_Topic_id : null) ??
        item.id ??
        0,
    )
    const title =
      topic.title ??
      item.title ??
      topic.titles?.find((titleItem) => titleItem.locale === locale)?.title ??
      topic.titles?.[0]?.title ??
      'Training Topic #' + trainingTopicId

    return new InductionTrainingTopicModel(
      trainingTopicId,
      title,
      Number(item.id ?? 0),
      trainingTopicId,
    )
  }
}
