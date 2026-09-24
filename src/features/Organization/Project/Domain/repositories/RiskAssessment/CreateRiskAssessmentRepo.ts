import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import CreateRiskAssessmentApiService from '../../../Data/apiServices/RiskAssessment/CreateRiskAssessmentApiService'
import RiskAssessmentModel from '../../../Data/models/RiskAssessment/RiskAssessmentModel'

export default class CreateRiskAssessmentRepo extends RepoInterface<RiskAssessmentModel> {
  private static instance: CreateRiskAssessmentRepo
  private constructor() { super() }
  static getInstance(): CreateRiskAssessmentRepo {
    if (!this.instance) this.instance = new CreateRiskAssessmentRepo()
    return this.instance
  }
  override get responseType(): ResponseType { return ResponseType.withoutData }
  onParse(data: Record<string, any>): RiskAssessmentModel { return RiskAssessmentModel.fromMap(data) }
  get serviceInstance(): ServicesInterface { return CreateRiskAssessmentApiService.getInstance() }
}
