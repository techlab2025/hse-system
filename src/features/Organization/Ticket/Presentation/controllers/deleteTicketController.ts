import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type TicketModel from '../../Data/models/TicketModel'
import DeleteTicketUseCase from '../../Domain/useCase/deleteTicketUseCase'

export default class DeleteTicketController extends ControllerInterface<TicketModel> {
  private static instance: DeleteTicketController
  private constructor() {
    super()
  }
  private DeleteTicketUseCase = new DeleteTicketUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteTicketController()
    }
    return this.instance
  }

  async deleteTicket(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<TicketModel> = await this.DeleteTicketUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        // useLoaderStore().endLoadingWithDialog();
      } else {
        throw new Error('Error while delete Ticket')
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
