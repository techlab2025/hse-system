import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type MeetingTypeModel from '../../Data/models/MeetingTypeModel'
import type AddMeetingTypeClonesParams from '../../Core/params/AddMeetingTypeClonesParams'
import AddMeetingTypeCloneUseCase from '../../Domain/useCase/addMeetingTypeCloneUseCase'

export default class MeetingTypeCloneController extends ControllerInterface<MeetingTypeModel> {
  private static instance: MeetingTypeCloneController
  private constructor() {
    super()
  }
  private addMeetingTypeCloneUseCase = new AddMeetingTypeCloneUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new MeetingTypeCloneController()
    }
    return this.instance
  }

  async addMeetingTypeClone(params: AddMeetingTypeClonesParams) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      params.validate()
      if (!params.validate().isValid) {
        params.validateOrThrow()
        return
      }
      const dataState: DataState<MeetingTypeModel> =
        await this.addMeetingTypeCloneUseCase.call(params)
      this.setLoading()
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog-error',
          titleContent: this.state.value.error?.title ?? 'Ann Error Occurred',
          imageElement: errorImage,
          messageContent: null,
        })
      }
    } catch (error: unknown) {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog-error',
        titleContent: this.state.value.error?.title ?? (error as string),
        imageElement: errorImage,
        messageContent: null,
      })
    }

    super.handleResponseDialogs()
    return this.state
  }
}
