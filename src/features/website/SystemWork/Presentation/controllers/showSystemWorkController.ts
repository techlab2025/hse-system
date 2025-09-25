import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type SystemWorkDetailsModel from '../../Data/models/SystemWorkDetailsModel'
import ShowSystemWorkUseCase from '../../Domain/useCase/showSystemWorkUseCase'



export default class ShowSystemWorkController extends ControllerInterface<SystemWorkDetailsModel> {
  private static instance: ShowSystemWorkController

  private constructor() {
    super()
  }

  private ShowSystemWorkUseCase = new ShowSystemWorkUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowSystemWorkController()
    }
    return this.instance
  }

  async showSystemWork(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<SystemWorkDetailsModel> = await this.ShowSystemWorkUseCase.call(params)

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
