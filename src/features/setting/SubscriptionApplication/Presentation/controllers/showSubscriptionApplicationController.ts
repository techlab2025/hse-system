import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import ShowSubscriptionUseCase from '../../Domain/useCase/showSubscriptionApplicationUseCase'
import type SubscriptionDetailsModel from '../../Data/models/SubscriptionApplicationDetailsModel'

export default class ShowSubscriptionController extends ControllerInterface<SubscriptionDetailsModel> {
  private static instance: ShowSubscriptionController

  private constructor() {
    super()
  }

  private showSubscriptionUseCase = new ShowSubscriptionUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowSubscriptionController()
    }
    return this.instance
  }

  async showSubscriptionType(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<SubscriptionDetailsModel> =
      await this.showSubscriptionUseCase.call(params)

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
