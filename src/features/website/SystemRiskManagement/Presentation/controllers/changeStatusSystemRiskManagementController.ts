import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type SystemRiskManagementModel from '../../Data/models/SystemRiskManagementModel'
import ChangeStatusSystemRiskManagementUseCase from '../../Domain/useCase/changeStatusSystemRiskManagementUseCase'




export default class ChangeStatusSystemRiskManagementController extends ControllerInterface<SystemRiskManagementModel> {
  private static instance: ChangeStatusSystemRiskManagementController
  private constructor() {
    super()
  }
  private ChangeStatusSystemRiskManagementUseCase = new ChangeStatusSystemRiskManagementUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ChangeStatusSystemRiskManagementController()
    }
    return this.instance
  }

  async changeStatusSystemRiskManagement(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<SystemRiskManagementModel> =
      await this.ChangeStatusSystemRiskManagementUseCase.call(params)

    this.setState(dataState)
    if (this.isDataSuccess()) {
      DialogSelector.instance.successDialog.openDialog({
        dialogName: 'dialog',
        titleContent: this.state.value.message,
        imageElement: successImage,
        messageContent: null,
      })
      // useLoaderStore().endLoadingWithDialog();
    } else {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog',
        titleContent: this.state.value.error?.title! ?? 'Ann Error Occurred',
        imageElement: errorImage,
        messageContent: null,
      })
      throw new Error('Error while addServices')
    }
    super.handleResponseDialogs()
    return this.state
  }
}
