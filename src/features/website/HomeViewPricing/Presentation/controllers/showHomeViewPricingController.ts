import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type HomeViewPricingDetailsModel from '../../Data/models/HomeViewPricingDetailsModel'
import ShowHomeViewPricingUseCase from '../../Domain/useCase/showHomeViewPricingUseCase'




export default class ShowHomeViewPricingController extends ControllerInterface<HomeViewPricingDetailsModel> {
  private static instance: ShowHomeViewPricingController

  private constructor() {
    super()
  }

  private ShowHomeViewPricingUseCase = new ShowHomeViewPricingUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowHomeViewPricingController()
    }
    return this.instance
  }

  async showHomeViewPricing(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<HomeViewPricingDetailsModel> = await this.ShowHomeViewPricingUseCase.call(params)

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
