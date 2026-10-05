// import LangModel from '@/features/setting/AuditActivity/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import AuditActivityModel from '../../Data/models/AuditActivityModel'
import { AddAuditActivityClonesApiService } from '../../Data/apiServices/AddAuditActivityClonesApiService'

class AddAuditActivityCloneRepo extends RepoInterface<AuditActivityModel> {
  private static instance: AddAuditActivityCloneRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddAuditActivityCloneRepo()
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
    return AddAuditActivityClonesApiService.getInstance()
  }
}

export { AddAuditActivityCloneRepo }
