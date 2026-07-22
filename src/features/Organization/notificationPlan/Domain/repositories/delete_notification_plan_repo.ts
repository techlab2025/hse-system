import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import NotificationPlanDetailsModel from '../../Data/models/notification_plan_model'
import { DeleteNotificationPlanApiService } from '../../Data/api_services/delete_notification_plan_api_service'

class DeleteNotificationPlanRepo extends RepoInterface<NotificationPlanDetailsModel> {
  private static instance: DeleteNotificationPlanRepo

  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteNotificationPlanRepo()
    }
    return this.instance
  }

  onParse(data: any): NotificationPlanDetailsModel {
    return NotificationPlanDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteNotificationPlanApiService.getInstance()
  }
}

export { DeleteNotificationPlanRepo }
