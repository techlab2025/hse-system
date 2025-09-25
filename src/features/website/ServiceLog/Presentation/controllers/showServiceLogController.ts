import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type ServiceLogDetailsModel from '../../Data/models/ServiceDetailsLogModel'
import ShowServiceLogUseCase from '../../Domain/useCase/showServiceLogUseCase'

export default class ShowServiceLogController extends ControllerInterface<ServiceLogDetailsModel> {
  private static instance: ShowServiceLogController

  private constructor() {
    super()
  }

  private showServiceLogUseCase = new ShowServiceLogUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowServiceLogController()
    }
    return this.instance
  }

  async showServiceLog(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<ServiceLogDetailsModel> =
      await this.showServiceLogUseCase.call(params)

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
