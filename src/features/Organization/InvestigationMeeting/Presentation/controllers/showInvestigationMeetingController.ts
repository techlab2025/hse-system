import { ShowInvestigationMeetingModel } from '@/features/setting/InvestigationMeeting/Data/models/showInvestigationMeetingModel'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import ShowInvestigationMeetingUseCase from '../../Domain/useCase/showInvestigationMeetingUseCase'

export default class ShowInvestigationMeetingController extends ControllerInterface<ShowInvestigationMeetingModel> {
  private static instance: ShowInvestigationMeetingController

  private constructor() {
    super()
  }

  private ShowInvestigationMeetingUseCase = new ShowInvestigationMeetingUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowInvestigationMeetingController()
    }
    return this.instance
  }

  async showInvestigationMeeting(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<ShowInvestigationMeetingModel> = await this.ShowInvestigationMeetingUseCase.call(params)

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
