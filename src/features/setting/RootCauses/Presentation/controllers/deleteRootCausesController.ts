import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import RootCausesModel from '@/features/setting/RootCauses/Data/models/RootCausesModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DeleteRootCausesUseCase from '@/features/setting/RootCauses/Domain/useCase/deleteRootCausesUseCase.ts'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'

export default class DeleteRootCausesController extends ControllerInterface<RootCausesModel> {
  private static instance: DeleteRootCausesController
  private constructor() {
    super()
  }
  private DeleteRootCausesUseCase = new DeleteRootCausesUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteRootCausesController()
    }
    return this.instance
  }

  async deleteRootCauses(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<RootCausesModel> = await this.DeleteRootCausesUseCase.call(params)

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
