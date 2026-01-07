import OrganizatoinEmployeeDetailsModel from '@/features/Organization/OrganizationEmployee/Data/models/OrganizatoinEmployeeDetailsModel'

export default class FetchTaskResultDetailsModel {
  public morphType: number
  public morphId: number
  public createdBy: CreatedBy
  public date: string
  public statistics: Statistics
  public inspectionInfo: InspectionInfo[]

  constructor(
    morphType: number,
    morphId: number,
    createdBy: CreatedBy,
    date: string,
    statistics: Statistics,
    inspectionInfo: InspectionInfo[],
  ) {
    this.morphType = morphType
    this.morphId = morphId
    this.createdBy = createdBy
    this.date = date
    this.statistics = statistics
    this.inspectionInfo = inspectionInfo
  }

  static fromMap(data: any): FetchTaskResultDetailsModel {
    return new FetchTaskResultDetailsModel(
      data.morph_type,
      data.morph_id,
      data.created_by,
      data.date,
      data.statistics,
      data.inspection_info,
    )
  }

  static example: FetchTaskResultDetailsModel = new FetchTaskResultDetailsModel(
    1,
    20,
    {
      id: 1,
      organization_employee_id: 1,
      name: 'Mohab',
      hierarchy: [],
    },
    '2025-01-01',
    {
      all_result: 20,
      results_received_today: 10,
      results_completed: 30,
      results_not_yet_completed: 50,
      delayed_results: 12,
    },
    [
      {
        serial: '1',
        employee: OrganizatoinEmployeeDetailsModel.example,
        date: '2025-01-01',
        time: '10:00',
      },
      {
        serial: '1',
        employee: OrganizatoinEmployeeDetailsModel.example,
        date: '2025-01-01',
        time: '10:00',
      },
      {
        serial: '1',
        employee: OrganizatoinEmployeeDetailsModel.example,
        date: '2025-01-01',
        time: '10:00',
      },
      {
        serial: '1',
        employee: OrganizatoinEmployeeDetailsModel.example,
        date: '2025-01-01',
        time: '10:00',
      },
    ],
  )
}
interface CreatedBy {
  id: number
  organization_employee_id: number
  name: string
  hierarchy: any[]
}
interface Statistics {
  all_result: number
  results_received_today: number
  results_completed: number
  results_not_yet_completed: number
  delayed_results: number
}
interface InspectionInfo {
  serial: string
  employee: OrganizatoinEmployeeDetailsModel
  date: string
  time: string
}
