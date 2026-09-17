import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import AddDrillPlanningApiService from '../../../Data/apiServices/Drill/AddDrillPlanningApiService'
import DrillModel from '../../../Data/models/Drill/DrillModel'

export default class AddDrillPlanningRepo extends RepoInterface<DrillModel> {
  private static instance: AddDrillPlanningRepo
  private constructor() { super() }
  static getInstance() {
    if (!this.instance) this.instance = new AddDrillPlanningRepo()
    return this.instance
  }
  override get responseType(): ResponseType { return ResponseType.withoutData }
  onParse(data: Record<string, unknown>): DrillModel { return DrillModel.fromMap(data) }
  get serviceInstance(): ServicesInterface { return AddDrillPlanningApiService.getInstance() }
}
