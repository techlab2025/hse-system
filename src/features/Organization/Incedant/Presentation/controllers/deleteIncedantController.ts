import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type IncedantModel from '../../Data/models/IncedantModel'
import DeleteIncedantUseCase from '../../Domain/useCase/deleteIncedantUseCase'

export default class DeleteIncedantController extends ControllerInterface<IncedantModel> {
  private static instance: DeleteIncedantController
  private constructor() {
    super()
  }
  private DeleteIncedantUseCase = new DeleteIncedantUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteIncedantController()
    }
    return this.instance
  }

  async deleteIncedant(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<IncedantModel> =
        await this.DeleteIncedantUseCase.call(params)

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
