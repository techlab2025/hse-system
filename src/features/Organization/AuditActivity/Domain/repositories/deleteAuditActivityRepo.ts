import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import AuditActivityModel from '../../Data/models/AuditActivityModel'
import { DeleteAuditActivityApiService } from '../../Data/apiServices/deleteAuditActivityApiService'

class DeleteAuditActivityRepo extends RepoInterface<AuditActivityModel> {
  private static instance: DeleteAuditActivityRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteAuditActivityRepo()
    }
    return this.instance
  }

  onParse(data: any): AuditActivityModel {
    return AuditActivityModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteAuditActivityApiService.getInstance()
  }
}

export { DeleteAuditActivityRepo }
