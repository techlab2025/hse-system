import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type MeetingTypeModel from '../../Data/models/MeetingTypeModel'
import EditMeetingTypeUseCase from '../../Domain/useCase/editMeetingTypeUseCase'
import type { Router } from 'vue-router'
import EditMeetingTypeParams from '../../Core/params/editMeetingTypeParams'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'
import { validatePeriodicNumberOfDays } from '../../Core/Enum/periodic_type_enum'

export default class EditMeetingTypeController extends ControllerInterface<MeetingTypeModel> {
  private static instance: EditMeetingTypeController

  private constructor() {
    super()
  }

  private EditMeetingTypeUseCase = new EditMeetingTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditMeetingTypeController()
    }
    return this.instance
  }

  async editMeetingType(params: EditMeetingTypeParams, router: Router) {
    try {
      const periodError = validatePeriodicNumberOfDays(params.periodicType, params.numberOfDays)
      if (periodError) {
        new OpenWarningDilaog(periodError).openDialog()
        return this.state
      }

      const dataState: DataState<MeetingTypeModel> = await this.EditMeetingTypeUseCase.call(params)
      this.setLoading()
      this.setState(dataState)

      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: this.state.value.message,
          imageElement: successImage,
          messageContent: null,
        })
        const root = router.currentRoute.value.path.startsWith('/admin')
          ? '/admin'
          : '/organization'
        await router.push(`${root}/meeting-types`)
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog-error',
          titleContent: this.state.value.error?.title ?? 'An Error Occurred',
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
