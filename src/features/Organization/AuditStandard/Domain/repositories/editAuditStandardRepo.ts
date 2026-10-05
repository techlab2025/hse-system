import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import AuditStandardModel from '../../Data/models/AuditStandardModel'
import { EditAuditStandardApiService } from '../../Data/apiServices/editAuditStandardApiService'

class EditAuditStandardRepo extends RepoInterface<AuditStandardModel> {
  private static instance: EditAuditStandardRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditAuditStandardRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }
  onParse(data: any): AuditStandardModel {
    return AuditStandardModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return EditAuditStandardApiService.getInstance()
  }
}

export { EditAuditStandardRepo }
