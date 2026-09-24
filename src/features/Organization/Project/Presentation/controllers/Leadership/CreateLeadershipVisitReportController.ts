import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type Params from '@/base/core/params/params'
import type LeadershipVisitModel from '../../../Data/models/Leadership/LeadershipVisitModel'
import CreateLeadershipVisitReportUseCase from '../../../Domain/useCase/Leadership/CreateLeadershipVisitReportUseCase'

export default class CreateLeadershipVisitReportController extends ControllerInterface<LeadershipVisitModel> {
  private static instance: CreateLeadershipVisitReportController
  private readonly useCase = new CreateLeadershipVisitReportUseCase()

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new CreateLeadershipVisitReportController()
    return this.instance
  }

  async createReport(params: Params) {
    this.setLoading()
    this.setState(await this.useCase.call(params))
    this.handleResponseDialogs()
    return this.state
  }
}
