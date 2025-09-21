import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import AddLangUseCase from '@/features/setting/languages/Domain/useCase/addLangUseCase'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from "@/assets/images/Success.png";
import errorImage from "@/assets/images/Error.png";
import type { Router } from 'vue-router'

export default class AddLangController extends ControllerInterface<LangModel> {
  private static instance: AddLangController
  private constructor() {
    super()
  }
  private AddLangUseCase = new AddLangUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddLangController()
    }
    return this.instance
  }

  async addLang(params: Params, router: Router, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const dataState: DataState<LangModel> = await this.AddLangUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })
        if (!draft) await router.push('/admin/languages')

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
