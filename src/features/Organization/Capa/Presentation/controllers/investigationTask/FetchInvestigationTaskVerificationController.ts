import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import FetchInvestigationTaskVerificationUseCase from '../../../Domain/useCase/InvestigationTask/FetchInvestigationTaskVerificationUseCase'
import type FetchInvestigationTaskVerificationModel from '../../../Data/models/FetchInvestigationTaskVerificationModel'

export default class FetchInvestigationTaskVerificationController extends SelectControllerInterface<FetchInvestigationTaskVerificationModel> {
  private static instance: FetchInvestigationTaskVerificationController
  private readonly useCase = new FetchInvestigationTaskVerificationUseCase()

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new FetchInvestigationTaskVerificationController()
    return this.instance
  }

  async getData(params: Params) {
    this.setLoading()
    const state: DataState<FetchInvestigationTaskVerificationModel> = await this.useCase.call(params)
    this.setState(state)
    return this.state
  }
}
