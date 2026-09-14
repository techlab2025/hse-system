import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type MeetingTypeDetailsModel from '../../Data/models/MeetingTypeDetailsModel'
import ShowMeetingTypeUseCase from '../../Domain/useCase/showMeetingTypeUseCase'

export default class ShowMeetingTypeController extends ControllerInterface<MeetingTypeDetailsModel> {
  private static instance: ShowMeetingTypeController

  private constructor() {
    super()
  }

  private showMeetingTypeUseCase = new ShowMeetingTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowMeetingTypeController()
    }
    return this.instance
  }

  async showMeetingType(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<MeetingTypeDetailsModel> =
      await this.showMeetingTypeUseCase.call(params)

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
