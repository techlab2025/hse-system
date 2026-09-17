import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import NotificationPlanDetailsModel from '../../Data/models/notification_plan_model'
import { ActiveNotificationPlanApiService } from '../../Data/api_services/active_notification_plan_api_service'

class ActiveNotificationPlanRepo extends RepoInterface<NotificationPlanDetailsModel> {
  private static instance: ActiveNotificationPlanRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ActiveNotificationPlanRepo()
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
    return ActiveNotificationPlanApiService.getInstance()
  }
}

export { ActiveNotificationPlanRepo }
