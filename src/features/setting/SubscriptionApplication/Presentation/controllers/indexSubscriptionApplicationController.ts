// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type SubscriptionApplicationModel from '../../Data/models/SubscriptionApplicationModel'
import IndexSubscriptionApplicationUseCase from '../../Domain/useCase/indexSubscriptionApplicationUseCase'
// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexSubscriptionApplicationController extends SelectControllerInterface<
  SubscriptionApplicationModel[]
> {
  private static instance: IndexSubscriptionApplicationController
  private constructor() {
    super()
  }
  private indexSubscriptionApplicationUseCase = new IndexSubscriptionApplicationUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexSubscriptionApplicationController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<SubscriptionApplicationModel[]> =
      await this.indexSubscriptionApplicationUseCase.call(params)

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
