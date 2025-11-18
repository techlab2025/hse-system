import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type IncedantDetailsModel from '../../Data/models/IncedantDetailsModel'
import ShowIncedantUseCase from '../../Domain/useCase/showIncedantUseCase'

export default class ShowIncedantController extends ControllerInterface<IncedantDetailsModel> {
  private static instance: ShowIncedantController

  private constructor() {
    super()
  }

  private ShowIncedantUseCase = new ShowIncedantUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowIncedantController()
    }
    return this.instance
  }

  async showIncedant(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<IncedantDetailsModel> = await this.ShowIncedantUseCase.call(params)

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
