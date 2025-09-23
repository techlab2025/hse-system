// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import IndexFactoryItemUseCase from '@/features/setting/FactoryItem/Domain/useCase/indexFactoryItemUseCase.ts'
import type FactoryItemModel from '@/features/setting/FactoryItem/Data/models/factoryItemModel.ts'
// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexFactoryItemController extends SelectControllerInterface<
  FactoryItemModel[]
> {
  private static instance: IndexFactoryItemController
  private constructor() {
    super()
  }
  private IndexFactoryUseCase = new IndexFactoryItemUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexFactoryItemController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<FactoryItemModel[]> =
      await this.IndexFactoryUseCase.call(params)

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
