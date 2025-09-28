import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type SystemRiskManagementModel from '../../Data/models/SystemRiskManagementModel'
import AddSystemRiskManagementUseCase from '../../Domain/useCase/addSystemRiskManagementUseCase'



export default class AddSystemRiskManagementController extends ControllerInterface<SystemRiskManagementModel> {
  private static instance: AddSystemRiskManagementController
  private constructor() {
    super()
  }
  private AddSystemRiskManagementUseCase = new AddSystemRiskManagementUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddSystemRiskManagementController()
    }
    return this.instance
  }

  async addSystemRiskManagement(params: Params, router: Router, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    try {

      // console.log("Ssssssss")
      const dataState: DataState<SystemRiskManagementModel> =
        await this.AddSystemRiskManagementUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })
        if (!draft) await router.push('/admin/system-risk-management')

        // useLoaderStore().endLoadingWithDialog();
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.error?.title ?? 'Ann Error Occurred',
          imageElement: errorImage,
          messageContent: null,
        })
      }
    } catch (error: unknown) {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog',
        titleContent: this.state.value.error?.title ?? (error as string),
        imageElement: errorImage,
        messageContent: null,
      })
    }

    super.handleResponseDialogs()
    return this.state
  }
}
