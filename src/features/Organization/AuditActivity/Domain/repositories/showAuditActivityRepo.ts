import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { ShowAuditActivityApiService } from '../../Data/apiServices/showAuditActivityApiService'
import AuditActivityDetailsModel from '../../Data/models/AuditActivityDetailsModel'

class ShowAuditActivityRepo extends RepoInterface<AuditActivityDetailsModel> {
  private static instance: ShowAuditActivityRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowAuditActivityRepo()
    }
    return this.instance
  }

  onParse(data: any): AuditActivityDetailsModel {
    return AuditActivityDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowAuditActivityApiService.getInstance()
  }
}

export { ShowAuditActivityRepo }
