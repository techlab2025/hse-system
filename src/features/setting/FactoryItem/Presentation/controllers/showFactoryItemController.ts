import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type FactoryItemModel from '@/features/setting/FactoryItem/Data/models/factoryItemModel.ts'
import ShowFactoryItemUseCase from '@/features/setting/FactoryItem/Domain/useCase/showFactoryItemUseCase.ts'

export default class ShowFactoryItemController extends ControllerInterface<FactoryItemModel> {
  private static instance: ShowFactoryItemController

  private constructor() {
    super()
  }

  private ShowFactoryUseCase = new ShowFactoryItemUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowFactoryItemController()
    }
    return this.instance
  }

  async showFactory(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<FactoryItemModel> = await this.ShowFactoryUseCase.call(params)

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
