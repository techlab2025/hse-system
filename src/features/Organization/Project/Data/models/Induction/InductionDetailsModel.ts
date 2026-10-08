import TitleInterface from '@/base/Data/Models/title_interface'
import FilesModel from '@/features/Organization/Inspection/Data/models/FetchTaskResultModels/FilesModel'
import InductionEmployeeModel from './InductionEmployeeModel'
import InductionModel from './InductionModel'
import InductionProjectLocationModel from './InductionProjectLocationModel'
import InductionProjectModel from './InductionProjectModel'
import InductionProjectZoneModel from './InductionProjectZoneModel'
import InductionTrainingTopicModel from './InductionTrainingTopicModel'

export default class InductionDetailsModel extends TitleInterface {
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

  static fromMap(data: Record<string, unknown>): InductionDetailsModel {
    const induction = InductionModel.fromMap(data)

    return new InductionDetailsModel(
      induction.id,
      induction.title,
      induction.instractor_id,
      induction.instructorEmployee,
      induction.project,
      induction.projectLocation,
      induction.projectZone,
      induction.date,
      induction.createdAt,
      induction.media,
      induction.image,
      induction.trainingTopic,
      induction.organisationEmployee,
    )
  }

  static example: InductionDetailsModel = new InductionDetailsModel(
    1,
    'Induction #1',
    1,
    null,
    null,
    null,
    null,
    '2022-01-01',
    null,
    [],
    null,
    [],
    [],
  )
}
