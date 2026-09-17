// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type PpeItemModel from '../../Data/models/PpeItemModel'
import IndexPpeItemUseCase from '../../Domain/useCase/indexPpeItemUseCase'


export default class IndexPpeItemController extends SelectControllerInterface<
  PpeItemModel[]
> {
  private static instance: IndexPpeItemController
  private constructor() {
    super()
  }
  private IndexPpeItemUseCase = new IndexPpeItemUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexPpeItemController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<PpeItemModel[]> =
      await this.IndexPpeItemUseCase.call(params)

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
