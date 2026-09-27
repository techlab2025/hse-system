import TitleInterface from '@/base/Data/Models/title_interface'
import FilesModel from '@/features/Organization/Inspection/Data/models/FetchTaskResultModels/FilesModel'
import InductionEmployeeModel from './InductionEmployeeModel'
import InductionProjectLocationModel from './InductionProjectLocationModel'
import InductionProjectModel from './InductionProjectModel'
import InductionProjectZoneModel from './InductionProjectZoneModel'
import InductionTrainingTopicModel from './InductionTrainingTopicModel'

type InductionResponse = {
  id?: number
  induction_id?: number
  title?: string
  name?: string
  date?: string | null
  created_at?: string | null
  instructor_employee_id?: Record<string, unknown> | number
  instractor_id?: number
  instructor_id?: number
  project_id?: Record<string, unknown> | number
  project_location_id?: Record<string, unknown> | number
  project_location_zone_id?: Record<string, unknown> | number
  media?: Record<string, unknown>[]
  image?: string[] | null
  attachments?: string[] | null
  induction_training_topics?: Record<string, unknown>[]
  trainingTopic?: Record<string, unknown>[]
  training_topic?: Record<string, unknown>[]
  training_topics?: Record<string, unknown>[]
  training_topic_ids?: Record<string, unknown>[]
  attendees?: Record<string, unknown>[]
  organisationEmployee?: Record<string, unknown>[]
  organisation_employee?: Record<string, unknown>[]
  organisation_employees?: Record<string, unknown>[]
}

export default class InductionModel extends TitleInterface {
  public id: number
  public inductionId: number
  public title: string
  public instractor_id: number
  public instructorEmployee: InductionEmployeeModel | null
  public instructorName: string
  public project: InductionProjectModel | null
  public projectId: number | null
  public projectTitle: string
  public projectLocation: InductionProjectLocationModel | null
  public projectLocationId: number | null
  public projectLocationTitle: string
  public projectZone: InductionProjectZoneModel | null
  public projectZoonId: number | null
  public projectZoneTitle: string
  public date: string | null
  public createdAt: string | null
  public media: FilesModel[]
  public image: string[] | null
  public trainingTopic: InductionTrainingTopicModel[]
  public organisationEmployee: InductionEmployeeModel[]

  constructor(
    id: number,
    title: string,
    instractor_id: number,
    instructorEmployee: InductionEmployeeModel | null,
    project: InductionProjectModel | null,
    projectLocation: InductionProjectLocationModel | null,
    projectZone: InductionProjectZoneModel | null,
    date: string | null,
    createdAt: string | null,
    media: FilesModel[],
    image: string[] | null,
    trainingTopic: InductionTrainingTopicModel[],
    organisationEmployee: InductionEmployeeModel[],
  ) {
    super({ id, title })
    this.id = id
    this.inductionId = id
    this.title = title
    this.instractor_id = instractor_id
    this.instructorEmployee = instructorEmployee
    this.instructorName = instructorEmployee?.title ?? instructorEmployee?.name ?? ''
    this.project = project
    this.projectId = project?.projectId ?? null
    this.projectTitle = project?.title ?? ''
    this.projectLocation = projectLocation
    this.projectLocationId = projectLocation?.projectLocationId ?? null
    this.projectLocationTitle = projectLocation?.title ?? ''
    this.projectZone = projectZone
    this.projectZoonId = projectZone?.projectZoneId ?? null
    this.projectZoneTitle = projectZone?.title ?? ''
    this.date = date
    this.createdAt = createdAt
    this.media = media
    this.image = image ?? (media.length ? media.map((item) => item.url) : null)
    this.trainingTopic = trainingTopic
    this.organisationEmployee = organisationEmployee
  }

  static fromMap(data: Record<string, unknown>): InductionModel {
    const induction = data as InductionResponse
    const id = Number(induction.induction_id ?? induction.id ?? 0)
    const instructorEmployee = typeof induction.instructor_employee_id === 'object'
      ? InductionEmployeeModel.fromMap(induction.instructor_employee_id)
      : null

    return new InductionModel(
      id,
      induction.title ?? induction.name ?? 'Induction #' + id,
      Number(instructorEmployee?.id ?? induction.instractor_id ?? induction.instructor_id ?? 0),
      instructorEmployee,
      typeof induction.project_id === 'object' ? InductionProjectModel.fromMap(induction.project_id) : null,
      typeof induction.project_location_id === 'object'
        ? InductionProjectLocationModel.fromMap(induction.project_location_id)
        : null,
      typeof induction.project_location_zone_id === 'object'
        ? InductionProjectZoneModel.fromMap(induction.project_location_zone_id)
        : null,
      induction.date ?? null,
      induction.created_at ?? null,
      (induction.media ?? []).map((item) => FilesModel.fromMap(item)),
      induction.image ?? induction.attachments ?? null,
      (induction.induction_training_topics ??
        induction.trainingTopic ??
        induction.training_topic ??
        induction.training_topics ??
        induction.training_topic_ids ??
        []
      ).map((item) => InductionTrainingTopicModel.fromMap(item)),
      (induction.attendees ??
        induction.organisationEmployee ??
        induction.organisation_employee ??
        induction.organisation_employees ??
        []
      ).map((item) => InductionEmployeeModel.fromMap(item)),
    )
  }

  static example: InductionModel[] = [
    new InductionModel(1, 'Induction #1', 1, null, null, null, null, '2022-01-01', null, [], null, [], []),
  ]
}
