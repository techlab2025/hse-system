import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type Params from '@/base/core/params/params'
import type LeadershipVisitModel from '../../Data/models/LeadershipVisitModel'
import CreateLeadershipPlanUseCase from '../../Domain/useCase/CreateLeadershipPlanUseCase'

export default class CreateLeadershipPlanController extends ControllerInterface<LeadershipVisitModel> {
  private static instance: CreateLeadershipPlanController
  private readonly useCase = new CreateLeadershipPlanUseCase()

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new CreateLeadershipPlanController()
    return this.instance
  }

  async createPlan(params: Params) {
    this.setLoading()
    this.setState(await this.useCase.call(params))
    this.handleResponseDialogs()
    return this.state
  }
}
