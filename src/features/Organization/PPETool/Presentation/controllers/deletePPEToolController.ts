import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type PPEToolModel from '../../Data/models/PPEToolModel'
import DeletePPEToolUseCase from '../../Domain/useCase/deletePPEToolUseCase'

export default class DeletePPEToolController extends ControllerInterface<PPEToolModel> {
  private static instance: DeletePPEToolController
  private constructor() {
    super()
  }
  private DeletePPEToolUseCase = new DeletePPEToolUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeletePPEToolController()
    }
    return this.instance
  }

  async deletePPETool(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<PPEToolModel> =
        await this.DeletePPEToolUseCase.call(params)
      this.setLoading()

      this.setState(dataState)
      if (this.isDataSuccess()) {
        // useLoaderStore().endLoadingWithDialog();
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
