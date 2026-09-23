import OrganizatoinEmployeeModel from '@/features/Organization/OrganizationEmployee/Data/models/OrganizatoinEmployeeModel'
import TraningTopicModel from '@/features/Organization/TraningTopic/Data/models/TraningTopicModel'

const asRecords = (value: unknown): Record<string, unknown>[] =>
  Array.isArray(value)
    ? value.filter(
        (item): item is Record<string, unknown> =>
          Boolean(item) && typeof item === 'object' && !Array.isArray(item),
      )
    : []

const asStringArray = (value: unknown): string[] | null =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : null

export default class InductionDetailsModel {
  public id: number
  public title: string
  public instractor_id: number
  public date: string | null
  public image: string[] | null
  public trainingTopic: TraningTopicModel[]
  public organisationEmployee: OrganizatoinEmployeeModel[]

  constructor(
    id: number,
    title: string,
    instractor_id: number,
    date: string | null,
    image: string[] | null,
    trainingTopic: TraningTopicModel[],
    organisationEmployee: OrganizatoinEmployeeModel[],
  ) {
    this.id = id
    this.title = title
    this.instractor_id = instractor_id
    this.date = date
    this.image = image
    this.trainingTopic = trainingTopic
    this.organisationEmployee = organisationEmployee
  }

  static fromMap(data: Record<string, unknown>): InductionDetailsModel {
    const id = Number(data.id ?? 0)
    const trainingTopics = data.trainingTopic ?? data.training_topic ?? data.training_topics ?? []
    const organisationEmployees =
      data.organisationEmployee ?? data.organisation_employee ?? data.organisation_employees ?? []

    return new InductionDetailsModel(
      id,
      String(data.title ?? data.name ?? `Induction #${id}`),
      Number(data.instractor_id ?? data.instructor_id ?? 0),
      typeof data.date === 'string' ? data.date : null,
      asStringArray(data.image),
      asRecords(trainingTopics).map((item) => TraningTopicModel.fromMap(item)),
      asRecords(organisationEmployees).map((item) => OrganizatoinEmployeeModel.fromMap(item)),
    )
  }

  static example: InductionDetailsModel =
    new InductionDetailsModel(
      1,
      'Induction 1',
      1,
      '2022-01-01',
      ['image1', 'image2'],
      [],
      [],
    )
}
