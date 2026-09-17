import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type ShiftModel from '../../Data/models/ShiftModel'
import DeleteShiftUseCase from '../../Domain/useCase/DeleteShiftUseCase'

export default class DeleteShiftController extends ControllerInterface<ShiftModel> {
  private static instance: DeleteShiftController
  private constructor() {
    super()
  }
  private DeleteShiftUseCase = new DeleteShiftUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteShiftController()
    }
    return this.instance
  }

  async deleteShift(params: Params) {
    try {
      const dataState: DataState<ShiftModel> = await this.DeleteShiftUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
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
