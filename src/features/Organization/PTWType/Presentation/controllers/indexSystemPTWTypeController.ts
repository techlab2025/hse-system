// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type PTWTypeModel from '../../Data/models/PTWTypeModel'
import IndexPTWTypeUseCase from '../../Domain/useCase/indexPTWTypeUseCase'

export default class IndexSystemPTWTypeController extends SelectControllerInterface<
  PTWTypeModel[]
> {
  private static instance: IndexSystemPTWTypeController
  private constructor() {
    super()
  }
  private IndexPTWTypeUseCase = new IndexPTWTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexSystemPTWTypeController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<PTWTypeModel[]> =
      await this.IndexPTWTypeUseCase.call(params)

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
