import TitleInterface from '@/base/Data/Models/title_interface'
import OrganizatoinEmployeeModel from '@/features/Organization/OrganizationEmployee/Data/models/OrganizatoinEmployeeModel'
import TraningTopicModel from '@/features/Organization/TraningTopic/Data/models/TraningTopicModel'

const asRecord = (value: unknown): Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}

const asPositiveNumber = (value: unknown): number | null => {
  const parsedValue = Number(value)

  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : null
}

const asRecords = (value: unknown): Record<string, unknown>[] =>
  Array.isArray(value)
    ? value.filter(
        (item): item is Record<string, unknown> =>
          Boolean(item) && typeof item === 'object' && !Array.isArray(item),
      )
    : []

const asStringArray = (value: unknown): string[] | null =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : null

const asTrainingTopicRecords = (value: unknown): Record<string, unknown>[] =>
  Array.isArray(value)
    ? value
        .map((item) => {
          if (typeof item === 'number') return { id: item }
          if (Boolean(item) && typeof item === 'object' && !Array.isArray(item)) {
            const record = item as Record<string, unknown>
            return {
              ...record,
              id: record.id ?? record.training_Topic_id ?? record.training_topic_id,
            }
          }
          return null
        })
        .filter((item): item is Record<string, unknown> => Boolean(item))
    : []

const asEmployeeRecords = (value: unknown): Record<string, unknown>[] =>
  asRecords(value).map((item) => ({
    ...item,
    id: item.id ?? item.organization_employee_id ?? item.organisation_employee_id,
  }))

export default class InductionModel extends TitleInterface {
  public id: number
  public title: string
  public instractor_id: number
  public date: string | null
  public image: string[] | null
  public trainingTopic: TraningTopicModel[]
  public organisationEmployee: OrganizatoinEmployeeModel[]
  public projectLocationId: number | null
  public projectZoonId: number | null

  constructor(
    id: number,
    title: string,
    instractor_id: number,
    date: string | null,
    image: string[] | null,
    trainingTopic: TraningTopicModel[],
    organisationEmployee: OrganizatoinEmployeeModel[],
    projectLocationId: number | null = null,
    projectZoonId: number | null = null,
  ) {
    super({ id, title })
    this.id = id
    this.title = title
    this.instractor_id = instractor_id
    this.date = date
    this.image = image
    this.trainingTopic = trainingTopic
    this.organisationEmployee = organisationEmployee
    this.projectLocationId = projectLocationId
    this.projectZoonId = projectZoonId
  }

  static fromMap(data: Record<string, unknown>): InductionModel {
    const id = Number(data.id ?? 0)
    const location = asRecord(data.location)
    const zoon = asRecord(data.zoon)
    const trainingTopics =
      data.trainingTopic ?? data.training_topic ?? data.training_topics ?? data.training_topic_ids ?? []
    const organisationEmployees =
      data.organisationEmployee ??
      data.organisation_employee ??
      data.organisation_employees ??
      data.attendees ??
      []

    return new InductionModel(
      id,
      String(data.title ?? data.name ?? `Induction #${id}`),
      Number(data.instractor_id ?? data.instructor_id ?? data.instructor_employee_id ?? 0),
      typeof data.date === 'string' ? data.date : null,
      asStringArray(data.attachments ?? data.image),
      asTrainingTopicRecords(trainingTopics).map((item) => TraningTopicModel.fromMap(item)),
      asEmployeeRecords(organisationEmployees).map((item) => OrganizatoinEmployeeModel.fromMap(item)),
      asPositiveNumber(data.projectLocationId ?? data.project_location_id ?? location.project_location_id),
      asPositiveNumber(
        data.projectZoonId ?? data.project_location_zone_id ?? data.project_location_zone_id ?? zoon.project_location_zone_id,
      ),
    )
  }

  static example: InductionModel[] = [
    new InductionModel(
      1,
      'Induction 1',
      1,
      '2022-01-01',
      ['image1', 'image2'],
      [],
      [],
    ),
  ]
}
