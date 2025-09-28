import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type SystemRiskTypeDetailsModel from '../../Data/models/SystemRiskTypeDetailsModel'
import ShowSystemRiskTypeUseCase from '../../Domain/useCase/showSystemRiskTypeUseCase'

export default class ShowSystemRiskTypeController extends ControllerInterface<SystemRiskTypeDetailsModel> {
  private static instance: ShowSystemRiskTypeController

  private constructor() {
    super()
  }

  private showSystemRiskTypeUseCase = new ShowSystemRiskTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowSystemRiskTypeController()
    }
    return this.instance
  }

  async showSystemRiskType(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<SystemRiskTypeDetailsModel> =
      await this.showSystemRiskTypeUseCase.call(params)

    this.setState(dataState)
    if (this.isDataSuccess()) {
      // useLoaderStore().endLoadingWithDialog();
    } else {
      throw new Error('Error while addServices')
    }
    super.handleResponseDialogs()
    return this.state
  }
}
