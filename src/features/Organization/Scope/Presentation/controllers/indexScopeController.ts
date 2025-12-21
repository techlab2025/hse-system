// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import IndexScopeUseCase from '../../Domain/useCase/indexScopeUseCase'
import type ScopeModel from '../../Data/models/ScopeModel'


export default class IndexScopeController extends SelectControllerInterface<
  ScopeModel[]
> {
  private static instance: IndexScopeController
  private constructor() {
    super()
  }
  private IndexScopeUseCase = new IndexScopeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexScopeController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<ScopeModel[]> =
      await this.IndexScopeUseCase.call(params)

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
