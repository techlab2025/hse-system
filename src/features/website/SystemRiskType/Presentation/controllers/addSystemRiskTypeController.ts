import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type SystemRiskTypeModel from '../../Data/models/SystemRiskTypeModel'
import AddSystemRiskTypeUseCase from '../../Domain/useCase/addSystemRiskTypeUseCase'

export default class AddSystemRiskTypeController extends ControllerInterface<SystemRiskTypeModel> {
  private static instance: AddSystemRiskTypeController
  private constructor() {
    super()
  }
  private addSystemRiskTypeUseCase = new AddSystemRiskTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddSystemRiskTypeController()
    }
    return this.instance
  }

  async addSystemRiskType(params: Params, router: Router, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      console.log('Ssssssss')
      const dataState: DataState<SystemRiskTypeModel> =
        await this.addSystemRiskTypeUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })
        if (!draft) await router.push('/admin/system_risk_type')

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
