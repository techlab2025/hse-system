import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import FetchRiskAssessmentsApiService from '../../../Data/apiServices/RiskAssessment/FetchRiskAssessmentsApiService'
import RiskAssessmentModel from '../../../Data/models/RiskAssessment/RiskAssessmentModel'

export default class FetchRiskAssessmentsRepo extends RepoInterface<RiskAssessmentModel[]> {
  private static instance: FetchRiskAssessmentsRepo
  private constructor() { super() }
  static getInstance(): FetchRiskAssessmentsRepo {
    if (!this.instance) this.instance = new FetchRiskAssessmentsRepo()
    return this.instance
  }
  onParse(data: Array<Record<string, any>>): RiskAssessmentModel[] { return data.map((item) => RiskAssessmentModel.fromMap(item)) }
  get serviceInstance(): ServicesInterface { return FetchRiskAssessmentsApiService.getInstance() }
}
