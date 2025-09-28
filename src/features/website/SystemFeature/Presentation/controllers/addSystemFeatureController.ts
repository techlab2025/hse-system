import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type SystemFeatureModel from '../../Data/models/SystemFeatureModel'
import AddSystemFeatureUseCase from '../../Domain/useCase/addSystemFeatureUseCase'

export default class AddSystemFeatureController extends ControllerInterface<SystemFeatureModel> {
  private static instance: AddSystemFeatureController
  private constructor() {
    super()
  }
  private addSystemFeatureUseCase = new AddSystemFeatureUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddSystemFeatureController()
    }
    return this.instance
  }

  async addSystemFeature(params: Params, router: Router, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      console.log('Ssssssss')
      const dataState: DataState<SystemFeatureModel> =
        await this.addSystemFeatureUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })
        if (!draft) await router.push('/admin/system_feature')

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
