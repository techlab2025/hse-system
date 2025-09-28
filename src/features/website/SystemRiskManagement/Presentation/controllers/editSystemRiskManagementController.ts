import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type SystemRiskManagementModel from '../../Data/models/SystemRiskManagementModel'
import EditSystemRiskManagementUseCase from '../../Domain/useCase/editSystemRiskManagementUseCase'




export default class EditSystemRiskManagementController extends ControllerInterface<SystemRiskManagementModel> {
  private static instance: EditSystemRiskManagementController

  private constructor() {
    super()
  }

  private EditSystemRiskManagementUseCase = new EditSystemRiskManagementUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditSystemRiskManagementController()
    }
    return this.instance
  }

  async editSystemRiskManagement(params: Params, router: any) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<SystemRiskManagementModel> = await this.EditSystemRiskManagementUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.message,
          imageElement: successImage,
          messageContent: null,
        })
        await router.push('/admin/system-risk-management')
        // console.log(this.state.value.data)
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.error?.title ?? 'Ann Error Occurred',
          imageElement: errorImage,
          messageContent: null,
        })
      }
    } catch (error: any) {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog',
        titleContent: this.state.value.message,
        imageElement: errorImage,
        messageContent: null,
      })
    }
    return this.state
  }
}
