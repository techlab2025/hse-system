import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type PTWTypeDetailsModel from '../../Data/models/PTWTypeDetailsModel'
import ShowPTWTypeUseCase from '../../Domain/useCase/showPTWTypeUseCase'

export default class ShowPTWTypeController extends ControllerInterface<PTWTypeDetailsModel> {
  private static instance: ShowPTWTypeController

  private constructor() {
    super()
  }

  private ShowPTWTypeUseCase = new ShowPTWTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowPTWTypeController()
    }
    return this.instance
  }

  async showPTWType(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<PTWTypeDetailsModel> =
      await this.ShowPTWTypeUseCase.call(params)

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
