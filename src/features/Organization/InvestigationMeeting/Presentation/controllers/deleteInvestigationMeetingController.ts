import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import DeleteInvestigationMeetingUseCase from '../../Domain/useCase/deleteInvestigationMeetingUseCase'
import type InvestigationMeetingModel from '../../Data/models/investigationMeetingModel'

export default class DeleteInvestigationMeetingController extends ControllerInterface<InvestigationMeetingModel> {
  private static instance: DeleteInvestigationMeetingController
  private constructor() {
    super()
  }
  private DeleteInvestigationMeetingUseCase = new DeleteInvestigationMeetingUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteInvestigationMeetingController()
    }
    return this.instance
  }

  async deleteInvestigationMeeting(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<InvestigationMeetingModel> =
        await this.DeleteInvestigationMeetingUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        // useLoaderStore().endLoadingWithDialog();
      } else {
        throw new Error('Error while addServices')
      }
    } catch (error: any) {
      console.log(error)
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog',
        titleContent: this.state.value.message,
        imageElement: errorImage,
        messageContent: null,
      })
    }
    super.handleResponseDialogs()
    return this.state
  }
}
