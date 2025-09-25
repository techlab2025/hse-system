// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import IndexHomeViewPricingUseCase from '../../Domain/useCase/indexHomeViewPricingUseCase'
import type HomeViewPricingModel from '../../Data/models/HomeViewPricingModel'



// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexHomeViewPricingController extends SelectControllerInterface<
  HomeViewPricingModel[]
> {
  private static instance: IndexHomeViewPricingController
  private constructor() {
    super()
  }
  private IndexHomeViewPricingUseCase = new IndexHomeViewPricingUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexHomeViewPricingController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<HomeViewPricingModel[]> =
      await this.IndexHomeViewPricingUseCase.call(params)

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
