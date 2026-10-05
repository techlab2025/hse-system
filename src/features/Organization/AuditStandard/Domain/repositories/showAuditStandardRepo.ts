import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { ShowAuditStandardApiService } from '../../Data/apiServices/showAuditStandardApiService'
import AuditStandardDetailsModel from '../../Data/models/AuditStandardDetailsModel'

class ShowAuditStandardRepo extends RepoInterface<AuditStandardDetailsModel> {
  private static instance: ShowAuditStandardRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowAuditStandardRepo()
    }
    return this.instance
  }

  onParse(data: any): AuditStandardDetailsModel {
    return AuditStandardDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowAuditStandardApiService.getInstance()
  }
}

export { ShowAuditStandardRepo }
