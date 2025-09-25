import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type SystemWorkModel from '../../Data/models/SystemWorkModel'
import DeleteSystemWorkUseCase from '../../Domain/useCase/deleteSystemWorkUseCase'




export default class DeleteSystemWorkController extends ControllerInterface<SystemWorkModel> {
  private static instance: DeleteSystemWorkController
  private constructor() {
    super()
  }
  private DeleteSystemWorkUseCase = new DeleteSystemWorkUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteSystemWorkController()
    }
    return this.instance
  }

  async deleteSystemWork(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<SystemWorkModel> =
        await this.DeleteSystemWorkUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        // useLoaderStore().endLoadingWithDialog();
      } else {
        throw new Error('Error while addServices')
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
