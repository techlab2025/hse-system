import type Params from '@/base/core/params/params'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type RiskAssessmentModel from '../../../Data/models/RiskAssessment/RiskAssessmentModel'
import CreateRiskAssessmentUseCase from '../../../Domain/useCase/RiskAssessment/CreateRiskAssessmentUseCase'

export default class CreateRiskAssessmentController extends ControllerInterface<RiskAssessmentModel> {
  private static instance: CreateRiskAssessmentController
  private readonly useCase = new CreateRiskAssessmentUseCase()
  private constructor() { super() }
  static getInstance(): CreateRiskAssessmentController {
    if (!this.instance) this.instance = new CreateRiskAssessmentController()
    return this.instance
  }
  async execute(params: Params) {
    this.setLoading()
    this.setState(await this.useCase.call(params))
    return this.state
  }
}
