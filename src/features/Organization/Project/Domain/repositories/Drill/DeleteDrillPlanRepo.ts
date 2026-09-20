import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import DeleteDrillPlanApiService from '../../../Data/apiServices/Drill/DeleteDrillPlanApiService'
import DrillTimelineItemModel from '../../../Data/models/Drill/DrillTimelineItemModel'

export default class DeleteDrillPlanRepo extends RepoInterface<DrillTimelineItemModel> {
  private static instance: DeleteDrillPlanRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new DeleteDrillPlanRepo()
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: Record<string, unknown>): DrillTimelineItemModel {
    return DrillTimelineItemModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteDrillPlanApiService.getInstance()
  }
}
