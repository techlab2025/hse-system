import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import ShowSubscriptionTypeUseCase from '../../Domain/useCase/showSubscriptionTypeUseCase'
import type SubscriptionTypeDetailsModel from '../../Data/models/SubscriptionTypeDetailsModel'

export default class ShowSubscriptionTypeController extends ControllerInterface<SubscriptionTypeDetailsModel> {
  private static instance: ShowSubscriptionTypeController

  private constructor() {
    super()
  }

  private showSubscriptionTypeUseCase = new ShowSubscriptionTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowSubscriptionTypeController()
    }
    return this.instance
  }

  async showSubscriptionTypeType(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<SubscriptionTypeDetailsModel> = await this.showSubscriptionTypeUseCase.call(params)

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
