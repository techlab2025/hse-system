import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import UpdateInvestigationTaskUseCase from '../../../Domain/useCase/InvestigationTask/UpdateInvestigationTaskUseCase'

export default class UpdateInvestigationTaskController extends SelectControllerInterface<void> {
  private static instance: UpdateInvestigationTaskController
  private constructor() {
    super()
  }
  private updateInvestigationTaskUseCase = new UpdateInvestigationTaskUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new UpdateInvestigationTaskController()
    }
    return this.instance
  }

  async getData(params: Params) {
    this.setLoading()
    const dataState: DataState<void> = await this.updateInvestigationTaskUseCase.call(params)

    this.setState(dataState)
    if (this.isDataSuccess()) {
    } else {
      throw new Error('Error while updateInvestigationTask')
    }
    super.handleResponseDialogs()
    return this.state
  }
}
