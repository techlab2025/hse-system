import OrganizatoinEmployeeDetailsModel from '@/features/Organization/OrganizationEmployee/Data/models/OrganizatoinEmployeeDetailsModel'

export default class FetchTaskResultDetailsModel {
  public allResult: number
  public resultsReceivedToday: number
  public resultsCompleted: number
  public resultsNotYetCompleted: number
  public delayedResults: number
  public morphType: number
  public createdAt: string
  public createdBy: OrganizatoinEmployeeDetailsModel

  constructor(
    allResult: number,
    resultsReceivedToday: number,
    resultsCompleted: number,
    resultsNotYetCompleted: number,
    delayedResults: number,
    morphType: number,
    createdAt: string,
    createdBy: OrganizatoinEmployeeDetailsModel,
  ) {
    this.allResult = allResult
    this.resultsReceivedToday = resultsReceivedToday
    this.resultsCompleted = resultsCompleted
    this.resultsNotYetCompleted = resultsNotYetCompleted
    this.delayedResults = delayedResults
    this.morphType = morphType
    this.createdAt = createdAt
    this.createdBy = createdBy
  }

  static fromMap(data: any): FetchTaskResultDetailsModel {
    return new FetchTaskResultDetailsModel(
      data.all_results,
      data.results_received_today,
      data.results_completed,
      data.results_not_yet_completed,
      data.delayed_results,
      data.morph_type,
      data.created_at,
      OrganizatoinEmployeeDetailsModel.fromMap(data.created_by),
    )
  }

  static example: FetchTaskResultDetailsModel = new FetchTaskResultDetailsModel(
    10,
    20,
    30,
    40,
    50,
    1,
    '2026-01-01',
    new OrganizatoinEmployeeDetailsModel(1, 1, 'name', []),
  )
}
// interface CreatedBy {
//   id: number
//   organization_employee_id: number
//   name: string
//   hierarchy: any[]
// }
// interface Statistics {
//   all_result: number
//   results_received_today: number
//   results_completed: number
//   results_not_yet_completed: number
//   delayed_results: number
// }
// interface InspectionInfo {
//   serial: string
//   employee: OrganizatoinEmployeeDetailsModel
//   date: string
//   time: string
// }
