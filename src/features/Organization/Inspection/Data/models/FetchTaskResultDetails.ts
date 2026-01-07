import TitleModel from '@/base/core/Models/title_model'

export default class FetchTaskResultDetailsModel extends TitleModel {
  public morphType: number
  public morphId: number
  public createdBy: CreatedBy
  public date: string
  public statistics: Statistics

  constructor(id: number, name: string, hierarchy: []) {
    super(name, id)
    this.hierarchy = hierarchy
  }

  static fromMap(data: any): FetchTaskResultDetailsModel {
    return new FetchTaskResultDetailsModel(data.id, data.name || data.title, data.hierarchy)
  }
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
