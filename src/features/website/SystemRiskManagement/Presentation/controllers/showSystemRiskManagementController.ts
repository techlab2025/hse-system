import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type SystemRiskManagementDetailsModel from '../../Data/models/SystemRiskManagementDetailsModel'
import ShowSystemRiskManagementUseCase from '../../Domain/useCase/showSystemRiskManagementUseCase'




export default class ShowSystemRiskManagementController extends ControllerInterface<SystemRiskManagementDetailsModel> {
  private static instance: ShowSystemRiskManagementController

  private constructor() {
    super()
  }

  private ShowSystemRiskManagementUseCase = new ShowSystemRiskManagementUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowSystemRiskManagementController()
    }
    return this.instance
  }

  async showSystemRiskManagement(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<SystemRiskManagementDetailsModel> = await this.ShowSystemRiskManagementUseCase.call(params)

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
