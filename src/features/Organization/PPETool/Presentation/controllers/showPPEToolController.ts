import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type PPEToolDetailsModel from '../../Data/models/PPEToolDetailsModel'
import ShowPPEToolUseCase from '../../Domain/useCase/showPPEToolUseCase'

export default class ShowPPEToolController extends ControllerInterface<PPEToolDetailsModel> {
  private static instance: ShowPPEToolController

  private constructor() {
    super()
  }

  private ShowPPEToolUseCase = new ShowPPEToolUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowPPEToolController()
    }
    return this.instance
  }

  async showPPETool(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<PPEToolDetailsModel> =
      await this.ShowPPEToolUseCase.call(params)

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
