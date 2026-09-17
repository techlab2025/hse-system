import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import SetInvestigationTaskVerificationApiService from '../../../Data/apiServices/InvestigationTask/SetInvestigationTaskVerificationApiService'

export default class SetInvestigationTaskVerificationRepository extends RepoInterface<void> {
  private static instance: SetInvestigationTaskVerificationRepository

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new SetInvestigationTaskVerificationRepository()
    return this.instance
  }

  get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  get serviceInstance(): ServicesInterface {
    return SetInvestigationTaskVerificationApiService.getInstance()
  }

  onParse(): void {
    return undefined
  }
}
