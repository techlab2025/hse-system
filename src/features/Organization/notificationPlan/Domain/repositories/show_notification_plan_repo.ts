import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import NotificationPlanDetailsModel from '../../Data/models/notification_plan_model'
import { ShowNotificationPlanApiService } from '../../Data/api_services/show_notification_plan_api_service'

class ShowNotificationPlanRepo extends RepoInterface<NotificationPlanDetailsModel> {
  private static instance: ShowNotificationPlanRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowNotificationPlanRepo()
    }
    return this.instance
  }

  // override get hasPagination(): boolean {
  //   return true;
  // }

  onParse(data: any): NotificationPlanDetailsModel {
    return NotificationPlanDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowNotificationPlanApiService.getInstance()
  }
}

export { ShowNotificationPlanRepo }
