import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import DeleteDrillActionApiService from '../../../Data/apiServices/Drill/DeleteDrillActionApiService'
import DrillTimelineItemModel from '../../../Data/models/Drill/DrillTimelineItemModel'

export default class DeleteDrillActionRepo extends RepoInterface<DrillTimelineItemModel> {
  private static instance: DeleteDrillActionRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new DeleteDrillActionRepo()
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: Record<string, unknown>): DrillTimelineItemModel {
    return DrillTimelineItemModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteDrillActionApiService.getInstance()
  }
}
