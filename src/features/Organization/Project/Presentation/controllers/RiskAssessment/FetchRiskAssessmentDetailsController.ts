import type Params from '@/base/core/params/params'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type RiskAssessmentModel from '../../../Data/models/RiskAssessment/RiskAssessmentModel'
import FetchRiskAssessmentDetailsUseCase from '../../../Domain/useCase/RiskAssessment/FetchRiskAssessmentDetailsUseCase'

export default class FetchRiskAssessmentDetailsController extends ControllerInterface<RiskAssessmentModel> {
  private static instance: FetchRiskAssessmentDetailsController
  private readonly useCase = new FetchRiskAssessmentDetailsUseCase()
  private constructor() { super() }
  static getInstance(): FetchRiskAssessmentDetailsController {
    if (!this.instance) this.instance = new FetchRiskAssessmentDetailsController()
    return this.instance
  }
  async execute(params: Params) {
    this.setLoading()
    this.setState(await this.useCase.call(params))
    return this.state
  }
}
