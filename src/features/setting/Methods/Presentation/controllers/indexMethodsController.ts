// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type MethodsModel from '../../Data/models/MethodModel'
import IndexMethodsUseCase from '../../Domain/useCase/indexMethodsUseCase'
// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexMethodsController extends SelectControllerInterface<
  MethodsModel[]
> {
  private static instance: IndexMethodsController
  private constructor() {
    super()
  }
  private IndexMethodsUseCase = new IndexMethodsUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexMethodsController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<MethodsModel[]> =
      await this.IndexMethodsUseCase.call(params)

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
