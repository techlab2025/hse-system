// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import IndexSubscriptionUseCase from '../../Domain/useCase/indexSubscriptionApplicationUseCase'
import type SubscriptionModel from '../../Data/models/SubscriptionModel'
// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexSubscriptionController extends SelectControllerInterface<SubscriptionModel[]> {
  private static instance: IndexSubscriptionController
  private constructor() {
    super()
  }
  private indexSubscriptionUseCase = new IndexSubscriptionUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexSubscriptionController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<SubscriptionModel[]> = await this.indexSubscriptionUseCase.call(params)

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
