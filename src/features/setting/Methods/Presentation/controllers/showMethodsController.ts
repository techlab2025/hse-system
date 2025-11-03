import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type MethodsDetailsModel from '../../Data/models/MethodsDetailsModel'
import ShowMethodsUseCase from '../../Domain/useCase/showMethodsUseCase'

export default class ShowMethodsController extends ControllerInterface<MethodsDetailsModel> {
  private static instance: ShowMethodsController

  private constructor() {
    super()
  }

  private ShowMethodsUseCase = new ShowMethodsUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowMethodsController()
    }
    return this.instance
  }

  async showMethods(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<MethodsDetailsModel> = await this.ShowMethodsUseCase.call(params)

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
