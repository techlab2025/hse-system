import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type ShiftModel from '../../Data/models/ShiftModel'
import AddShiftUseCase from '../../Domain/useCase/AddShiftUseCase'
import type AddShiftParams from '../../Core/params/AddShiftParams'
import type { Router } from 'vue-router'

export default class AddShiftController extends ControllerInterface<ShiftModel> {
  private static instance: AddShiftController
  private constructor() {
    super()
  }
  private AddShiftUseCase = new AddShiftUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddShiftController()
    }
    return this.instance
  }

  async addShift(params: AddShiftParams, router?: Router) {
    try {
      const dataState: DataState<ShiftModel> = await this.AddShiftUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: 'Added was successful',
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
