/* eslint-disable @typescript-eslint/no-explicit-any */
import TitleInterface from '@/base/Data/Models/title_interface'
import FilesModel from '@/features/Organization/Inspection/Data/models/FetchTaskResultModels/FilesModel'
import InductionEmployeeModel from './InductionEmployeeModel'
import InductionProjectLocationModel from './InductionProjectLocationModel'
import InductionProjectModel from './InductionProjectModel'
import InductionProjectZoneModel from './InductionProjectZoneModel'
import InductionTrainingTopicModel from './InductionTrainingTopicModel'

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

  static fromMap(data: any): InductionModel {
    const id = data.induction_id ?? data.id
    const instructorEmployee = data.instructor_employee_id
      ? InductionEmployeeModel.fromMap(data.instructor_employee_id)
      : null

    return new InductionModel(
      id,
      data.title ?? data.name ?? 'Induction #' + id,
      instructorEmployee?.id ?? data.instractor_id ?? data.instructor_id ?? 0,
      instructorEmployee,
      data.project_id ? InductionProjectModel.fromMap(data.project_id) : null,
      data.project_location_id ? InductionProjectLocationModel.fromMap(data.project_location_id) : null,
      data.project_location_zone_id
        ? InductionProjectZoneModel.fromMap(data.project_location_zone_id)
        : null,
      data.date,
      data.created_at,
      data.media?.map((item: any) => FilesModel.fromMap(item)) ?? [],
      data.image ?? data.attachments ?? null,
      data.induction_training_topics?.map((item: any) => InductionTrainingTopicModel.fromMap(item)) ?? [],
      data.attendees?.map((item: any) => InductionEmployeeModel.fromMap(item)) ?? [],
    )
  }

  static example: InductionModel[] = [
    new InductionModel(1, 'Induction #1', 1, null, null, null, null, '2022-01-01', null, [], null, [], []),
  ]
}
