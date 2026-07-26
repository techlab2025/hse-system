import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import FetchInvestigationTaskVerificationApiService from '../../../Data/apiServices/InvestigationTask/FetchInvestigationTaskVerificationApiService'
import FetchInvestigationTaskVerificationModel from '../../../Data/models/FetchInvestigationTaskVerificationModel'

export default class FetchInvestigationTaskVerificationRepository extends RepoInterface<FetchInvestigationTaskVerificationModel> {
  private static instance: FetchInvestigationTaskVerificationRepository

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new FetchInvestigationTaskVerificationRepository()
    return this.instance
  }

  get responseType(): ResponseType {
    return ResponseType.withData
  }

  get serviceInstance(): ServicesInterface {
    return FetchInvestigationTaskVerificationApiService.getInstance()
  }

  onParse(data: any): FetchInvestigationTaskVerificationModel {
    console.log('FetchInvestigationTaskVerificationRepository onParse data', data ? FetchInvestigationTaskVerificationModel.fromMap(data) : new FetchInvestigationTaskVerificationModel({}))
    return data ? FetchInvestigationTaskVerificationModel.fromMap(data[0]) : new FetchInvestigationTaskVerificationModel({})
  }
}
