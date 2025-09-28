import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type SystemRiskManagementModel from '../../Data/models/SystemRiskManagementModel'
import DeleteSystemRiskManagementUseCase from '../../Domain/useCase/deleteSystemRiskManagementUseCase'




export default class DeleteSystemRiskManagementController extends ControllerInterface<SystemRiskManagementModel> {
  private static instance: DeleteSystemRiskManagementController
  private constructor() {
    super()
  }
  private DeleteSystemRiskManagementUseCase = new DeleteSystemRiskManagementUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteSystemRiskManagementController()
    }
    return this.instance
  }

  async deleteSystemRiskManagement(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<SystemRiskManagementModel> =
        await this.DeleteSystemRiskManagementUseCase.call(params)

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
