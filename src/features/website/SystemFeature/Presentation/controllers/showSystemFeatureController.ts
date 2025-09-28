import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type SystemFeatureDetailsModel from '../../Data/models/SystemFeatureDetailsModel'
import ShowSystemFeatureUseCase from '../../Domain/useCase/showSystemFeatureUseCase'

export default class ShowSystemFeatureController extends ControllerInterface<SystemFeatureDetailsModel> {
  private static instance: ShowSystemFeatureController

  private constructor() {
    super()
  }

  private showSystemFeatureUseCase = new ShowSystemFeatureUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowSystemFeatureController()
    }
    return this.instance
  }

  async showSystemFeature(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<SystemFeatureDetailsModel> =
      await this.showSystemFeatureUseCase.call(params)

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
