import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import AuditActivityModel from '../../Data/models/AuditActivityModel'
import { EditAuditActivityApiService } from '../../Data/apiServices/editAuditActivityApiService'

class EditAuditActivityRepo extends RepoInterface<AuditActivityModel> {
  private static instance: EditAuditActivityRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditAuditActivityRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }
  onParse(data: any): AuditActivityModel {
    return AuditActivityModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return EditAuditActivityApiService.getInstance()
  }
}

export { EditAuditActivityRepo }
