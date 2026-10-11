import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import FetchDrillsApiService from '../../../Data/apiServices/Drill/FetchDrillsApiService'
import DrillModel from '../../../Data/models/Drill/DrillModel'

export default class FetchDrillsRepo extends RepoInterface<DrillModel[]> {
  private static instance: FetchDrillsRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new FetchDrillsRepo()
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: Array<Record<string, unknown>>): DrillModel[] {
    return data.map((item) => DrillModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return FetchDrillsApiService.getInstance()
  }
}
