import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import DeleteRoleUseCase from '../../Domain/useCase/deleteRoleUseCase'
import type RoleModel from '../../Data/models/RoleModel'

export default class DeleteRoleController extends ControllerInterface<RoleModel> {
  private static instance: DeleteRoleController
  private constructor() {
    super()
  }
  private DeleteRoleUseCase = new DeleteRoleUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteRoleController()
    }
    return this.instance
  }

  async deleteRole(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<RoleModel> =
        await this.DeleteRoleUseCase.call(params)

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
