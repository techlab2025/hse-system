import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type VisitActivityDetailsModel from '../../Data/models/VisitActivityDetailsModel'
import ShowVisitActivityUseCase from '../../Domain/useCase/showVisitActivityUseCase'

export default class ShowVisitActivityController extends ControllerInterface<VisitActivityDetailsModel> {
  private static instance: ShowVisitActivityController
  private readonly showVisitActivityUseCase = new ShowVisitActivityUseCase()

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new ShowVisitActivityController()
    return this.instance
  }

  async showVisitActivity(params: Params) {
    this.setLoading()
    const dataState: DataState<VisitActivityDetailsModel> =
      await this.showVisitActivityUseCase.call(params)
    this.setState(dataState)
    super.handleResponseDialogs()
    return this.state
  }
}
