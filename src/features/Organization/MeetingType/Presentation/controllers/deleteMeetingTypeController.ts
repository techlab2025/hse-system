import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type MeetingTypeModel from '../../Data/models/MeetingTypeModel'
import DeleteMeetingTypeUseCase from '../../Domain/useCase/deleteMeetingTypeUseCase'

export default class DeleteMeetingTypeController extends ControllerInterface<MeetingTypeModel> {
  private static instance: DeleteMeetingTypeController
  private constructor() {
    super()
  }
  private DeleteMeetingTypeUseCase = new DeleteMeetingTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteMeetingTypeController()
    }
    return this.instance
  }

  async deleteMeetingType(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<MeetingTypeModel> =
        await this.DeleteMeetingTypeUseCase.call(params)
      this.setLoading()

      this.setState(dataState)
      if (this.isDataSuccess()) {
        // useLoaderStore().endLoadingWithDialog();
      } else {
        throw new Error('Error while addServices')
      }
    } catch (error: any) {
      console.log(error)
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog-error',
        titleContent: this.state.value.message,
        imageElement: errorImage,
        messageContent: null,
      })
    }
    super.handleResponseDialogs()
    return this.state
  }
}
