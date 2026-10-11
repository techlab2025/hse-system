import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type InductionDetailsModel from '../../../Data/models/Induction/InductionDetailsModel'
import ShowInductionUseCase from '../../../Domain/useCase/Induction/showInductionUseCase'

export default class ShowInductionController extends ControllerInterface<InductionDetailsModel> {
  private static instance: ShowInductionController
  private readonly useCase = new ShowInductionUseCase()

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new ShowInductionController()
    return this.instance
  }

  async showInduction(params: Params) {
    this.setLoading()

    const dataState: DataState<InductionDetailsModel> = await this.useCase.call(params)
    this.setState(dataState)

    if (this.isDataSuccess()) {
      // success state is already stored
    } else {
      throw new Error('Error while addServices')
    }

    super.handleResponseDialogs()
    return this.state
  }
}
