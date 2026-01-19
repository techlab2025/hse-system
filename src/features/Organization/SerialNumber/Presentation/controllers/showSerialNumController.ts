import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
// import { useUserStore } from '@/stores/user'
// import SerialNumUseCase from '../../Domain/useCase/createSerialNumUseCase'
import type SerialNumberModel from '../../Data/models/serialNumberModel'
// import CreateSerialNumberUseCase from '../../Domain/useCase/showserialNumUseCase'
import ShowSerialNumberUseCase from '../../Domain/useCase/showserialNumUseCase'

export default class ShowSerialNumController extends ControllerInterface<SerialNumberModel[]> {
  private static instance: ShowSerialNumController
  private constructor() {
    super()
  }
  private showSerialNumberUseCase = new ShowSerialNumberUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowSerialNumController()
    }
    return this.instance
  }

  async ShowSerialNumber(params: Params, router: Router) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const dataState: DataState<SerialNumberModel[]> =
        await this.showSerialNumberUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        // DialogSelector.instance.successDialog.openDialog({
        //   dialogName: 'dialog',
        //   titleContent: 'Added was successful',
        //   imageElement: successImage,
        //   messageContent: null,
        // })

        if (router.currentRoute?.value?.path.includes('serial-number')) {
          router.push('/organization/serial-number')
        }

        // useLoaderStore().endLoadingWithDialog();
      } else {
        // DialogSelector.instance.failedDialog.openDialog({
        //   dialogName: 'dialog',
        //   titleContent: this.state.value.error?.title ?? 'Ann Error Occurred',
        //   imageElement: errorImage,
        //   messageContent: null,
        // })
      }
    } catch (error: unknown) {
      // DialogSelector.instance.failedDialog.openDialog({
      //   dialogName: 'dialog',
      //   titleContent: this.state.value.error?.title ?? (error as string),
      //   imageElement: errorImage,
      //   messageContent: null,
      // })
    }

    super.handleResponseDialogs()

    return this.state
  }
}
