import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type PermissionModel from '../../Data/models/PermissionModel'
import DeletePermissionUseCase from '../../Domain/useCase/deletePermissionUseCase'

export default class DeletePermissionController extends ControllerInterface<PermissionModel> {
  private static instance: DeletePermissionController
  private constructor() {
    super()
  }
  private DeletePermissionUseCase = new DeletePermissionUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeletePermissionController()
    }
    return this.instance
  }

  async deletePermission(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<PermissionModel> =
        await this.DeletePermissionUseCase.call(params)

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
