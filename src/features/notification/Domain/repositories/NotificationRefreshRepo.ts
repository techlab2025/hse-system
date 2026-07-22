import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import NotificationTokenModel from '../../Data/models/NotificationTokenModel'
import { RefreshNotificationApiService } from '../../Data/apiServices/RefreshNotificationApiService'

// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class NotificationRefreshTokenRepo extends RepoInterface<NotificationTokenModel> {
  private static instance: NotificationRefreshTokenRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new NotificationRefreshTokenRepo()
    }
    return this.instance
  }

  onParse(data: any): NotificationTokenModel {
    return NotificationTokenModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return RefreshNotificationApiService.getInstance()
  }
}

export { NotificationRefreshTokenRepo }
