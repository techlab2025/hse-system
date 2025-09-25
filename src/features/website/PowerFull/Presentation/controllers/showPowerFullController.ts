import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type PowerFullDetailsModel from '../../Data/models/PowerFullDetailsModel'
import ShowPowerFullUseCase from '../../Domain/useCase/showPowerFullUseCase'



export default class ShowPowerFullController extends ControllerInterface<PowerFullDetailsModel> {
  private static instance: ShowPowerFullController

  private constructor() {
    super()
  }

  private ShowPowerFullUseCase = new ShowPowerFullUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowPowerFullController()
    }
    return this.instance
  }

  async showPowerFull(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<PowerFullDetailsModel> = await this.ShowPowerFullUseCase.call(params)

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
