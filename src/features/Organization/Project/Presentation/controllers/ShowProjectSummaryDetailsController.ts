import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type ShowProjectSummaryDetailsModel from '../../Data/models/ShowProjectSummaryDetailsModel'
import ShowProjectSummaryDetailsUseCase from '../../Domain/useCase/ShowProjectSummaryDetailsUseCase'

export default class ShowProjectSummaryDetailsController extends ControllerInterface<ShowProjectSummaryDetailsModel> {
  private static instance: ShowProjectSummaryDetailsController
  private readonly showProjectSummaryDetailsUseCase = new ShowProjectSummaryDetailsUseCase()

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowProjectSummaryDetailsController()
    }
    return this.instance
  }

  async showProjectSummaryDetails(params: Params) {
    this.setLoading()
    const dataState: DataState<ShowProjectSummaryDetailsModel> =
      await this.showProjectSummaryDetailsUseCase.call(params)

    this.setState(dataState)
    if (!this.isDataSuccess()) {
      throw new Error(this.state.value.error?.title ?? 'Unable to load project summary details')
    }
    super.handleResponseDialogs()
    return this.state
  }
}
