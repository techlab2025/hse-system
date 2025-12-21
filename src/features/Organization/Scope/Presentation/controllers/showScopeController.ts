import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import ShowScopeUseCase from '../../Domain/useCase/showScopeUseCase'
import type ScopeDetailsModel from '../../Data/models/ScopeDetailsModel'

export default class ShowScopeteController extends ControllerInterface<ScopeDetailsModel> {
  private static instance: ShowScopeteController

  private constructor() {
    super()
  }

  private ShowScopeUseCase = new ShowScopeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowScopeteController()
    }
    return this.instance
  }

  async showScope(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<ScopeDetailsModel> = await this.ShowScopeUseCase.call(params)

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
