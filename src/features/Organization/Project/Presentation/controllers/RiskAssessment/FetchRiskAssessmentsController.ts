import type Params from '@/base/core/params/params'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type RiskAssessmentModel from '../../../Data/models/RiskAssessment/RiskAssessmentModel'
import FetchRiskAssessmentsUseCase from '../../../Domain/useCase/RiskAssessment/FetchRiskAssessmentsUseCase'

export default class FetchRiskAssessmentsController extends ControllerInterface<RiskAssessmentModel[]> {
  private static instance: FetchRiskAssessmentsController
  private readonly useCase = new FetchRiskAssessmentsUseCase()
  private constructor() { super() }
  static getInstance(): FetchRiskAssessmentsController {
    if (!this.instance) this.instance = new FetchRiskAssessmentsController()
    return this.instance
  }
  async execute(params: Params) {
    this.setLoading()
    this.setState(await this.useCase.call(params))
    return this.state
  }
}
