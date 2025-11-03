import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type MethodsModel from '../../Data/models/MethodModel'
import DeleteMethodsUseCase from '../../Domain/useCase/deleteMethodsUseCase'

export default class DeleteMethodsController extends ControllerInterface<MethodsModel> {
  private static instance: DeleteMethodsController
  private constructor() {
    super()
  }
  private DeleteMethodsUseCase = new DeleteMethodsUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteMethodsController()
    }
    return this.instance
  }

  async deleteMethods(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<MethodsModel> =
        await this.DeleteMethodsUseCase.call(params)

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
