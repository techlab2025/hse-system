import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import ShowInvestigatingUseCase from '../../Domain/useCase/showInvestigatingUseCase'
import InvestigatingDetailsModel from '../../Data/models/investigatingDetailsModel'

export default class ShowInvestigatingController extends ControllerInterface<InvestigatingDetailsModel> {
  private static instance: ShowInvestigatingController

  private constructor() {
    super()
  }

  private ShowInvestigatingUseCase = new ShowInvestigatingUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowInvestigatingController()
    }
    return this.instance
  }

  async showInvestigating(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<InvestigatingDetailsModel> =
      await this.ShowInvestigatingUseCase.call(params)

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
