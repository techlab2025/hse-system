import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import FetchPPEActivityToolsApiService from '../../../Data/apiServices/ppematrix/FetchPPEActivityToolsApiService'
import PPEActivityToolsModel from '../../../Data/models/ppematrix/PPEActivityToolsModel'

export default class FetchPPEActivityToolsRepo extends RepoInterface<PPEActivityToolsModel[]> {
  private static instance: FetchPPEActivityToolsRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new FetchPPEActivityToolsRepo()
    return this.instance
  }

  onParse(data: Record<string, unknown> | Record<string, unknown>[]): PPEActivityToolsModel[] {
    return Array.isArray(data) ? data.map((item) => PPEActivityToolsModel.fromMap(item)) : []
  }

  get serviceInstance(): ServicesInterface {
    return FetchPPEActivityToolsApiService.getInstance()
  }
}
