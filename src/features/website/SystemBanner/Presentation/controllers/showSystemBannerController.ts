import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type SystemBannerDetailsModel from '../../Data/models/SystemBannerDetailsModel'
import ShowSystemBannerUseCase from '../../Domain/useCase/showSystemBannerUseCase'

export default class ShowSystemBannerController extends ControllerInterface<SystemBannerDetailsModel> {
  private static instance: ShowSystemBannerController

  private constructor() {
    super()
  }

  private showSystemBannerUseCase = new ShowSystemBannerUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowSystemBannerController()
    }
    return this.instance
  }

  async showSystemBanner(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<SystemBannerDetailsModel> =
      await this.showSystemBannerUseCase.call(params)

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
