import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
// import { useUserStore } from '@/stores/user'
import SerialNumUseCase from '../../Domain/useCase/createSerialNumUseCase'
import type SerialNumberModel from '../../Data/models/serialNumberModel'

export default class SerialNumController extends ControllerInterface<SerialNumberModel> {
  private static instance: SerialNumController
  private constructor() {
    super()
  }
  private AddSerialNumberUseCase = new SerialNumUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new SerialNumController()
    }
    return this.instance
  }

  async addSerialNumber(params: Params, router: Router) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const dataState: DataState<SerialNumberModel> = await this.AddSerialNumberUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })

        if (router.currentRoute?.value?.path.includes('serial-number')) {
          router.push('/organization/serial-number')
        }

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
