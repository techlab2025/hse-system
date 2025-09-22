import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from "@/assets/images/Success.png";
import errorImage from "@/assets/images/Error.png";
import type IndustryModel from '../../Data/Models/IndustryModel'
import DeleteIndustryUseCase from '../../Domain/useCase/deleteIndustryUseCase'

export default class DeleteIndustryController extends ControllerInterface<IndustryModel> {
  private static instance: DeleteIndustryController
  private constructor() {
    super()
  }
  private deleteIndustryUseCase = new DeleteIndustryUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteIndustryController()
    }
    return this.instance
  }

  async DeleteIndustry(params: Params, router: any, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const dataState: DataState<IndustryModel> = await this.deleteIndustryUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })

        // console.log(this.state.value.data)
        // console.log(draft)
        if (!draft) await router.push('/')

        // useLoaderStore().endLoadingWithDialog();
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
        titleContent: this.state.value.error?.title,
        imageElement: errorImage,
        messageContent: null,
      })
    }

    super.handleResponseDialogs()
    return this.state
  }
}
