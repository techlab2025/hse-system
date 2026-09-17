import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import FetchCorrectiveTasksApiService from '../../Data/apiServices/FetchCorrectiveTasksApiService'
import TaskReportModel from '../../Data/models/TaskReportModel'

export default class CorrectiveTasksRepository extends RepoInterface<TaskReportModel[]> {
  private static instance: CorrectiveTasksRepository

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new CorrectiveTasksRepository()
    return this.instance
  }

  get hasPagination(): boolean {
    return true
  }

  get serviceInstance(): ServicesInterface {
    return FetchCorrectiveTasksApiService.getInstance()
  }

  onParse(data: Record<string, unknown> | Array<Record<string, unknown>>): TaskReportModel[] {
    const nestedData = Array.isArray(data) ? data : data.data
    const tasks = Array.isArray(nestedData) ? nestedData : []
    return tasks.map((task) => TaskReportModel.fromMap(task))
  }
}
