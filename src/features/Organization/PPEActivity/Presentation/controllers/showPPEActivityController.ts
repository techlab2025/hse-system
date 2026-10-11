import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type PPEActivityDetailsModel from '../../Data/models/PPEActivityDetailsModel'
import ShowPPEActivityUseCase from '../../Domain/useCase/showPPEActivityUseCase'

export default class ShowPPEActivityController extends ControllerInterface<PPEActivityDetailsModel> {
  private static instance: ShowPPEActivityController

  private constructor() {
    super()
  }

  private ShowPPEActivityUseCase = new ShowPPEActivityUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowPPEActivityController()
    }
    return this.instance
  }

  async showPPEActivity(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<PPEActivityDetailsModel> =
      await this.ShowPPEActivityUseCase.call(params)

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
