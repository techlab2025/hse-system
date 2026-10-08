import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import AuditStandardModel from '../../Data/models/AuditStandardModel'
import { DeleteAuditStandardApiService } from '../../Data/apiServices/deleteAuditStandardApiService'

class DeleteAuditStandardRepo extends RepoInterface<AuditStandardModel> {
  private static instance: DeleteAuditStandardRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteAuditStandardRepo()
    }
    return this.instance
  }

  onParse(data: any): AuditStandardModel {
    return AuditStandardModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteAuditStandardApiService.getInstance()
  }
}

export { DeleteAuditStandardRepo }
