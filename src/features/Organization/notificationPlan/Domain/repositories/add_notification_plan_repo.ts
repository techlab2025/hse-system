import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { AddNotificationPlanApiService } from '../../Data/api_services/add_notification_plan_api_service'
import NotificationPlanModel from '../../Data/models/notification_plan_model'

class AddNotificationPlanRepo extends RepoInterface<NotificationPlanModel> {
  private static instance: AddNotificationPlanRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddNotificationPlanRepo()
    }
    return this.instance
  }

  onParse(data: any): NotificationPlanModel {
    return NotificationPlanModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddNotificationPlanApiService.getInstance()
  }
}

export { AddNotificationPlanRepo }
