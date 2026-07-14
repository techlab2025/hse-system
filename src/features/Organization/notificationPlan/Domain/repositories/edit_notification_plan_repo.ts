import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import NotificationPlanDetailsModel from '../../Data/models/notification_plan_model'
import { EditNotificationPlanApiService } from '../../Data/api_services/edit_notification_plan_api_service'

class EditNotificationPlanRepo extends RepoInterface<NotificationPlanDetailsModel> {
  private static instance: EditNotificationPlanRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditNotificationPlanRepo()
    }
    return this.instance
  }

  onParse(data: any): NotificationPlanDetailsModel {
    return NotificationPlanDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return EditNotificationPlanApiService.getInstance()
  }
}

export { EditNotificationPlanRepo }
