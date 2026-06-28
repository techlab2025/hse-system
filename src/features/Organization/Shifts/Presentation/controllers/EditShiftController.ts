import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type ShiftModel from '../../Data/models/ShiftModel'
import EditShiftUseCase from '../../Domain/useCase/EditShiftUseCase'
import type { Router } from 'vue-router'
import type EditShiftParams from '../../Core/params/EditShiftParams'

export default class EditShiftController extends ControllerInterface<ShiftModel> {
  private static instance: EditShiftController

  private constructor() {
    super()
  }

  private EditShiftUseCase = new EditShiftUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditShiftController()
    }
    return this.instance
  }

  async editShift(params: EditShiftParams, router?: Router) {
    try {
      const dataState: DataState<ShiftModel> = await this.EditShiftUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: this.state.value.message,
          imageElement: successImage,
          messageContent: null,
        })
        router?.push({ name: 'Shifts' })
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog-error',
          titleContent: this.state.value.error?.title ?? 'Ann Error Occurred',
          imageElement: errorImage,
          messageContent: null,
        })
      }
    } catch (error: any) {
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
