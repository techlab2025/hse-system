import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type SystemComponentDetailsModel from '../../Data/models/SystemComponentDetailsModel'
import ShowSystemComponentUseCase from '../../Domain/useCase/showSystemComponentUseCase'

export default class ShowSystemComponentController extends ControllerInterface<SystemComponentDetailsModel> {
  private static instance: ShowSystemComponentController

  private constructor() {
    super()
  }

  private showSystemComponentUseCase = new ShowSystemComponentUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowSystemComponentController()
    }
    return this.instance
  }

  async showSystemComponent(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<SystemComponentDetailsModel> =
      await this.showSystemComponentUseCase.call(params)

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
