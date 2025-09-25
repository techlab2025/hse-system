import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type ServiceFeatureDetailsModel from '../../Data/models/ServiceDetailsFeatureModel'
import ShowServiceFeatureUseCase from '../../Domain/useCase/showServiceFeatureUseCase'

export default class ShowServiceFeatureController extends ControllerInterface<ServiceFeatureDetailsModel> {
  private static instance: ShowServiceFeatureController

  private constructor() {
    super()
  }

  private showServiceFeatureUseCase = new ShowServiceFeatureUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowServiceFeatureController()
    }
    return this.instance
  }

  async showServiceFeature(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<ServiceFeatureDetailsModel> =
      await this.showServiceFeatureUseCase.call(params)

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
