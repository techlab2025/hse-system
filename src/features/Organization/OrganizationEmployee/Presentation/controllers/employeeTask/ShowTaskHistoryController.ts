import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type IndexOwnTaskModel from '../../../Data/models/IndexOwnTaskModel'
import showTaskHistoryUseCase from '../../../Domain/useCase/employeeTask/ShowTaskHistoryUseCase'

export default class showTaskHistoryController extends ControllerInterface<IndexOwnTaskModel> {
  private static instance: showTaskHistoryController

  private constructor() {
    super()
  }

  private showTaskHistoryUseCase = new showTaskHistoryUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new showTaskHistoryController()
    }
    return this.instance
  }

  async showOrganizatoinEmployee(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<IndexOwnTaskModel> =
      await this.showTaskHistoryUseCase.call(params)

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
