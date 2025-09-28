import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type SystemRiskTypeModel from '../../Data/models/SystemRiskTypeModel'
import DeleteSystemRiskTypeUseCase from '../../Domain/useCase/deleteSystemRiskTypeUseCase'

export default class DeleteSystemRiskTypeController extends ControllerInterface<SystemRiskTypeModel> {
  private static instance: DeleteSystemRiskTypeController
  private constructor() {
    super()
  }
  private deleteSystemRiskTypeUseCase = new DeleteSystemRiskTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteSystemRiskTypeController()
    }
    return this.instance
  }

  async deleteSystemRiskType(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<SystemRiskTypeModel> =
        await this.deleteSystemRiskTypeUseCase.call(params)

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
