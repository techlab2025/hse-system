import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import AddDrillActionApiService from '../../../Data/apiServices/Drill/AddDrillActionApiService'
import DrillModel from '../../../Data/models/Drill/DrillModel'

export default class AddDrillActionRepo extends RepoInterface<DrillModel> {
  private static instance: AddDrillActionRepo
  private constructor() { super() }
  static getInstance() {
    if (!this.instance) this.instance = new AddDrillActionRepo()
    return this.instance
  }
  override get responseType(): ResponseType { return ResponseType.withoutData }
  onParse(data: Record<string, unknown>): DrillModel { return DrillModel.fromMap(data) }
  get serviceInstance(): ServicesInterface { return AddDrillActionApiService.getInstance() }
}
