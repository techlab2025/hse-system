import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import NotificationPlanModel from '../../Data/models/notification_plan_model'
import { IndexNotificationPlanApiService } from '../../Data/api_services/index_notification_plan_api_service'

class IndexNotificationPlanRepo extends RepoInterface<NotificationPlanModel[]> {
  private static instance: IndexNotificationPlanRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexNotificationPlanRepo()
    }
    return this.instance
  }

  onParse(data: any): NotificationPlanModel[] {
    return Array.isArray(data?.data) ? data.data.map((item: any) => NotificationPlanModel.fromMap(item)) : []
  }

  get serviceInstance(): ServicesInterface {
    return IndexNotificationPlanApiService.getInstance()
  }
}

export { IndexNotificationPlanRepo }
