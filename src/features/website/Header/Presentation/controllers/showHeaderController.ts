import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type HeaderDetailsModel from '../../Data/models/HeaderDetailsModel'
import ShowHeaderUseCase from '../../Domain/useCase/showHeaderUseCase'


export default class ShowHeaderController extends ControllerInterface<HeaderDetailsModel> {
  private static instance: ShowHeaderController

  private constructor() {
    super()
  }

  private ShowHeaderUseCase = new ShowHeaderUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowHeaderController()
    }
    return this.instance
  }

  async showHeader(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<HeaderDetailsModel> = await this.ShowHeaderUseCase.call(params)

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
