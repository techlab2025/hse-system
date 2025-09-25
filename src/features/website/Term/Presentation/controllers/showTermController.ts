import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type TermDetailsModel from '../../Data/models/TermDetailsModel'
import ShowTermUseCase from '../../Domain/useCase/showTermUseCase'

export default class ShowTermController extends ControllerInterface<TermDetailsModel> {
  private static instance: ShowTermController

  private constructor() {
    super()
  }

  private ShowTermUseCase = new ShowTermUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowTermController()
    }
    return this.instance
  }

  async showTerm(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<TermDetailsModel> =
      await this.ShowTermUseCase.call(params)

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
