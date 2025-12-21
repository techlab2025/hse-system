import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import DeleteScopeUseCase from '../../Domain/useCase/deleteScopeUseCase'
import type ScopeModel from '../../Data/models/ScopeModel'

export default class DeleteScopeController extends ControllerInterface<ScopeModel> {
  private static instance: DeleteScopeController
  private constructor() {
    super()
  }
  private DeleteScopeUseCase = new DeleteScopeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteScopeController()
    }
    return this.instance
  }

  async deleteScope(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<ScopeModel> = await this.DeleteScopeUseCase.call(params)

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
