import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import TicketTypeModel from '../../Data/models/TicketTypeModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DeleteTicketTypeUseCase from '../../Domain/useCase/deleteTicketTypeUseCase'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'

export default class DeleteTicketTypeController extends ControllerInterface<TicketTypeModel> {
  private static instance: DeleteTicketTypeController
  private constructor() {
    super()
  }
  private DeleteTicketTypeUseCase = new DeleteTicketTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteTicketTypeController()
    }
    return this.instance
  }

  async deleteTicketType(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<TicketTypeModel> = await this.DeleteTicketTypeUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        // useLoaderStore().endLoadingWithDialog();
      } else {
        throw new Error('Error while delete TicketType')
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
