// import LangModel from '@/features/setting/AuditStandard/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import AuditStandardModel from '../../Data/models/AuditStandardModel'
import { AddAuditStandardClonesApiService } from '../../Data/apiServices/AddAuditStandardClonesApiService'

class AddAuditStandardCloneRepo extends RepoInterface<AuditStandardModel> {
  private static instance: AddAuditStandardCloneRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddAuditStandardCloneRepo()
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
    return AddAuditStandardClonesApiService.getInstance()
  }
}

export { AddAuditStandardCloneRepo }
