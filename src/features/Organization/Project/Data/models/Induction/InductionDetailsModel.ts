import OrganizatoinEmployeeModel from '@/features/Organization/OrganizationEmployee/Data/models/OrganizatoinEmployeeModel'
import TraningTopicModel from '@/features/Organization/TraningTopic/Data/models/TraningTopicModel'

export default class InductionDetailsModel {
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

  static fromMap(data: any): InductionDetailsModel {
    return new InductionDetailsModel(
      data.induction_id ?? data.id,
      data.title ?? data.name ?? `Induction #${data.induction_id ?? data.id}`,
      data.instructor_employee_id ?? data.instractor_id,
      data.date,
      data.media?.map((item: any) => item.url) ?? data.attachments ?? data.image ?? [],
      data.induction_training_topics?.map((item: any) =>
        TraningTopicModel.fromMap({
          id: item.training_topic_id,
          title: item.training_topic?.title ?? item.title ?? `Training Topic #${item.training_topic_id}`,
        }),
      ) ?? data.trainingTopic ?? [],
      data.attendees?.map((item: any) =>
        OrganizatoinEmployeeModel.fromMap({
          ...item,
          id: item.organization_employee_id ?? 0,
          name: item.name ?? item.organization_employee?.name ?? '',
          phone: item.phone ?? '',
          email: item.email ?? '',
          certificates: item.certificates ?? [],
          hierarchy: item.hierarchy ?? [],
          employee_certificates: item.employee_certificates ?? [],
          validation_status: item.validation_status ?? 0,
          password: item.password ?? '',
          hierarchies: item.hierarchies ?? [],
        }),
      ) ?? data.organisationEmployee ?? [],
      data.project_location_id ?? data.projectLocationId ?? null,
      data.project_location_zone_id ?? data.projectZoonId ?? null,
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
