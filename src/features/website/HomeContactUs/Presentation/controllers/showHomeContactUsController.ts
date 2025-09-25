import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type HomeContactUsDetailsModel from '../../Data/models/HomeContactUsDetailsModel'
import ShowHomeContactUsUseCase from '../../Domain/useCase/showHomeContactUsUseCase'


export default class ShowHomeContactUsController extends ControllerInterface<HomeContactUsDetailsModel> {
  private static instance: ShowHomeContactUsController

  private constructor() {
    super()
  }

  private ShowHomeContactUsUseCase = new ShowHomeContactUsUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowHomeContactUsController()
    }
    return this.instance
  }

  async showHomeContactUs(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<HomeContactUsDetailsModel> = await this.ShowHomeContactUsUseCase.call(params)

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
