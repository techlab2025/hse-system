import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type PPEActivityModel from '../../Data/models/PPEActivityModel'
import DeletePPEActivityUseCase from '../../Domain/useCase/deletePPEActivityUseCase'

export default class DeletePPEActivityController extends ControllerInterface<PPEActivityModel> {
  private static instance: DeletePPEActivityController
  private constructor() {
    super()
  }
  private DeletePPEActivityUseCase = new DeletePPEActivityUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeletePPEActivityController()
    }
    return this.instance
  }

  async deletePPEActivity(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<PPEActivityModel> =
        await this.DeletePPEActivityUseCase.call(params)
      this.setLoading()

      this.setState(dataState)
      if (this.isDataSuccess()) {
        // useLoaderStore().endLoadingWithDialog();
      } else {
        throw new Error('Error while addServices')
      }
    } catch (error: any) {
      console.log(error)
      const errorMessage =
        this.state.value.error?.title ??
        this.state.value.message ?? error?.message ??'An Error Occurred'
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog-error',
        titleContent: 'An Error Occurred',
        imageElement: errorImage,
        messageContent: errorMessage,
      })
    }
    super.handleResponseDialogs()
    return this.state
  }
}
