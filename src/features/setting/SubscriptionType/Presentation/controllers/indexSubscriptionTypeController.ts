// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import IndexSubscriptionTypeUseCase from '../../Domain/useCase/indexSubscriptionTypeUseCase'
import type SubscriptionTypeModel from '../../Data/models/SubscriptionTypeModel'
// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexSubscriptionTypeController extends SelectControllerInterface<SubscriptionTypeModel[]> {
  private static instance: IndexSubscriptionTypeController
  private constructor() {
    super()
  }
  private indexSubscriptionTypeUseCase = new IndexSubscriptionTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexSubscriptionTypeController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<SubscriptionTypeModel[]> = await this.indexSubscriptionTypeUseCase.call(params)

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
