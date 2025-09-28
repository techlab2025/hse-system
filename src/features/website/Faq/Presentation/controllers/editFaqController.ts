import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type FaqModel from '../../Data/models/FaqModel'
import EditFaqUseCase from '../../Domain/useCase/editFaqUseCase'

export default class EditFaqController extends ControllerInterface<FaqModel> {
  private static instance: EditFaqController

  private constructor() {
    super()
  }

  private EditFaqUseCase = new EditFaqUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditFaqController()
    }
    return this.instance
  }

  async editFaq(params: Params, router: any) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<FaqModel> = await this.EditFaqUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.message,
          imageElement: successImage,
          messageContent: null,
        })
        await router.push('/admin/faq')
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
