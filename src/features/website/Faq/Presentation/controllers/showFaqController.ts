import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type FaqteDetailsModel from '../../Data/models/FaqDetailsModel'
import ShowFaqteUseCase from '../../Domain/useCase/showFaqUseCase'

export default class ShowFaqteController extends ControllerInterface<FaqteDetailsModel> {
  private static instance: ShowFaqteController

  private constructor() {
    super()
  }

  private ShowFaqteUseCase = new ShowFaqteUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowFaqteController()
    }
    return this.instance
  }

  async showFaq(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<FaqteDetailsModel> =
      await this.ShowFaqteUseCase.call(params)

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
