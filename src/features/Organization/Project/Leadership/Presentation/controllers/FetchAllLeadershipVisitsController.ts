import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type Params from '@/base/core/params/params'
import type LeadershipVisitModel from '../../Data/models/LeadershipVisitModel'
import FetchAllLeadershipVisitsUseCase from '../../Domain/useCase/FetchAllLeadershipVisitsUseCase'

export default class FetchAllLeadershipVisitsController extends ControllerInterface<LeadershipVisitModel[]> {
  private static instance: FetchAllLeadershipVisitsController
  private readonly useCase = new FetchAllLeadershipVisitsUseCase()

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new FetchAllLeadershipVisitsController()
    return this.instance
  }

  async fetchVisits(params: Params) {
    this.setLoading()
    this.setState(await this.useCase.call(params))
    this.handleResponseDialogs()
    return this.state
  }
}
