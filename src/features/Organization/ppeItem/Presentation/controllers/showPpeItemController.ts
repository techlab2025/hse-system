import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type PpeItemDetailsModel from '../../Data/models/PpeItemDetailsModel'
import ShowPpeItemUseCase from '../../Domain/useCase/showPpeItemUseCase'

export default class ShowPpeItemController extends ControllerInterface<PpeItemDetailsModel> {
  private static instance: ShowPpeItemController

  private constructor() {
    super()
  }

  private ShowPpeItemUseCase = new ShowPpeItemUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowPpeItemController()
    }
    return this.instance
  }

  async showPpeItem(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<PpeItemDetailsModel> =
      await this.ShowPpeItemUseCase.call(params)

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
