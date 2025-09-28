import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type FaqModel from '../../Data/models/FaqModel'
import DeleteFaqUseCase from '../../Domain/useCase/deleteFaqUseCase'

export default class DeleteFaqController extends ControllerInterface<FaqModel> {
  private static instance: DeleteFaqController
  private constructor() {
    super()
  }
  private DeleteFaqUseCase = new DeleteFaqUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteFaqController()
    }
    return this.instance
  }

  async deleteFaq(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<FaqModel> =
        await this.DeleteFaqUseCase.call(params)

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
