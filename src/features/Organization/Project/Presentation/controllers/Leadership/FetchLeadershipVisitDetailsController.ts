import type Params from '@/base/core/params/params'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type LeadershipVisitDetailsModel from '../../../Data/models/Leadership/LeadershipVisitDetailsModel'
import FetchLeadershipVisitDetailsUseCase from '../../../Domain/useCase/Leadership/FetchLeadershipVisitDetailsUseCase'

export default class FetchLeadershipVisitDetailsController extends ControllerInterface<LeadershipVisitDetailsModel> {
  private static instance: FetchLeadershipVisitDetailsController
  private readonly useCase = new FetchLeadershipVisitDetailsUseCase()

  private constructor() {
    super()
  }

  static getInstance(): FetchLeadershipVisitDetailsController {
    if (!this.instance) this.instance = new FetchLeadershipVisitDetailsController()
    return this.instance
  }

  async fetchDetails(params: Params) {
    this.setLoading()
    this.setState(await this.useCase.call(params))
    this.handleResponseDialogs()
    return this.state
  }
}
