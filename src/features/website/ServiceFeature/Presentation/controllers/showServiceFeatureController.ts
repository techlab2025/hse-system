import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type ServiceDetailsModel from '../../Data/models/ServiceDetailsFeatureModel'
import ShowServiceUseCase from '../../Domain/useCase/showServiceFeatureUseCase'

export default class ShowServiceController extends ControllerInterface<ServiceDetailsModel> {
  private static instance: ShowServiceController

  private constructor() {
    super()
  }

  private ShowServiceUseCase = new ShowServiceUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowServiceController()
    }
    return this.instance
  }

  async showService(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<ServiceDetailsModel> = await this.ShowServiceUseCase.call(params)

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
