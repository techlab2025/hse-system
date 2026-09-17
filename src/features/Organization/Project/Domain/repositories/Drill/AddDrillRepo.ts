import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import AddDrillApiService from '../../../Data/apiServices/Drill/AddDrillApiService'
import DrillModel from '../../../Data/models/Drill/DrillModel'

export default class AddDrillRepo extends RepoInterface<DrillModel> {
  private static instance: AddDrillRepo
  private constructor() { super() }
  static getInstance() {
    if (!this.instance) this.instance = new AddDrillRepo()
    return this.instance
  }
  override get responseType(): ResponseType { return ResponseType.withoutData }
  onParse(data: Record<string, unknown>): DrillModel { return DrillModel.fromMap(data) }
  get serviceInstance(): ServicesInterface { return AddDrillApiService.getInstance() }
}
