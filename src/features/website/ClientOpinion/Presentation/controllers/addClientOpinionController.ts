import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type ClientOpinionModel from '../../Data/models/ClientOpinionModel'
import AddClientOpinionUseCase from '../../Domain/useCase/addClientOpinionUseCase'

export default class AddClientOpinionController extends ControllerInterface<ClientOpinionModel> {
  private static instance: AddClientOpinionController
  private constructor() {
    super()
  }
  private AddClientOpinionUseCase = new AddClientOpinionUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddClientOpinionController()
    }
    return this.instance
  }

  async addClientOpinion(params: Params, router: Router, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    try {

      console.log("Ssssssss")
      const dataState: DataState<ClientOpinionModel> =
        await this.AddClientOpinionUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })
        if (!draft) await router.push('/admin/client-opinions')

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
