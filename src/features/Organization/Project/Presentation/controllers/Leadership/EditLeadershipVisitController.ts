import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type Params from '@/base/core/params/params'
import type LeadershipVisitModel from '../../../Data/models/Leadership/LeadershipVisitModel'
import EditLeadershipVisitUseCase from '../../../Domain/useCase/Leadership/EditLeadershipVisitUseCase'

export default class EditLeadershipVisitController extends ControllerInterface<LeadershipVisitModel> {
  private static instance: EditLeadershipVisitController
  private readonly useCase = new EditLeadershipVisitUseCase()

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new EditLeadershipVisitController()
    return this.instance
  }

  async editVisit(params: Params) {
    this.setLoading()
    this.setState(await this.useCase.call(params))
    this.handleResponseDialogs()
    return this.state
  }
}
