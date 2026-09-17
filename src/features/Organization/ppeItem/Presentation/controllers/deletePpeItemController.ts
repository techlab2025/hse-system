import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type PpeItemModel from '../../Data/models/PpeItemModel'
import DeletePpeItemUseCase from '../../Domain/useCase/deletePpeItemUseCase'

export default class DeletePpeItemController extends ControllerInterface<PpeItemModel> {
  private static instance: DeletePpeItemController
  private constructor() {
    super()
  }
  private DeletePpeItemUseCase = new DeletePpeItemUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeletePpeItemController()
    }
    return this.instance
  }

  async deletePpeItem(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<PpeItemModel> =
        await this.DeletePpeItemUseCase.call(params)
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
