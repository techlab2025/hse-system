import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'

import type { Router } from 'vue-router'
import EditMeetingTypeUseCase from '../../Domain/useCase/editMeetingTypeUseCase'
import type MeetingTypeModel from '../../Data/models/MeetingTypeModel'

export default class EditMeetingTypeController extends ControllerInterface<MeetingTypeModel> {
  private static instance: EditMeetingTypeController

  private constructor() {
    super()
  }

  private editMeetingTypeUseCase = new EditMeetingTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditMeetingTypeController()
    }
    return this.instance
  }

  async editMeetingType(params: Params, router: Router) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<MeetingTypeModel> = await this.editMeetingTypeUseCase.call(params)
      this.setLoading()

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: this.state.value.message,
          imageElement: successImage,
          messageContent: null,
        })
        // const root = router.currentRoute.value.path.startsWith('/admin') ? '/admin' : '/organization'
        // await router.push(`${root}/ppe-items`)
        // console.log(this.state.value.data)
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog-error',
          titleContent: this.state.value.error?.title ?? 'Ann Error Occurred',
          imageElement: errorImage,
          messageContent: null,
        })
      }
    } catch {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog-error',
        titleContent: this.state.value.message,
        imageElement: errorImage,
        messageContent: null,
      })
    }
    return this.state
  }
}
