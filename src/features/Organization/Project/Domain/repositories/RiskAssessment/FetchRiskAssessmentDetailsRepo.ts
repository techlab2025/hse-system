import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import FetchRiskAssessmentDetailsApiService from '../../../Data/apiServices/RiskAssessment/FetchRiskAssessmentDetailsApiService'
import RiskAssessmentModel from '../../../Data/models/RiskAssessment/RiskAssessmentModel'

export default class FetchRiskAssessmentDetailsRepo extends RepoInterface<RiskAssessmentModel> {
  private static instance: FetchRiskAssessmentDetailsRepo
  private constructor() { super() }
  static getInstance(): FetchRiskAssessmentDetailsRepo {
    if (!this.instance) this.instance = new FetchRiskAssessmentDetailsRepo()
    return this.instance
  }
  onParse(data: Record<string, any>): RiskAssessmentModel { return RiskAssessmentModel.fromMap(data) }
  get serviceInstance(): ServicesInterface { return FetchRiskAssessmentDetailsApiService.getInstance() }
}
