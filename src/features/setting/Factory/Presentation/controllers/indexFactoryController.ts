// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import IndexFactoryUseCase from '../../Domain/useCase/indexFactoryUseCase'
import type FactoryModel from '../../Data/models/FactoryModel'
// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexFactoryController extends SelectControllerInterface<
  FactoryModel[]
> {
  private static instance: IndexFactoryController
  private constructor() {
    super()
  }
  private IndexFactoryUseCase = new IndexFactoryUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexFactoryController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<FactoryModel[]> =
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
