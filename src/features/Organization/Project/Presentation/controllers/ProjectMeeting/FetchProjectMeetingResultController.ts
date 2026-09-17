import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import FetchProjectMeetingResultUseCase from '../../../Domain/useCase/ProjectMeeting/FetchProjectMeetingResultUseCase'
import type ProjectMeetingDetails from '../../../Data/models/ProjectMeeting/ProjectMeetingDetailsModel'

export default class FetchProjectMeetingResultController extends ControllerInterface<ProjectMeetingDetails> {
  private static instance: FetchProjectMeetingResultController
  private constructor() {
    super()
  }
  private fetchProjectMeetingResultUseCase = new FetchProjectMeetingResultUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchProjectMeetingResultController()
    }
    return this.instance
  }

  async FetchProjectMeetingResult(params: Params, router: Router, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const dataState: DataState<ProjectMeetingDetails> =
        await this.fetchProjectMeetingResultUseCase.call(params)
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
