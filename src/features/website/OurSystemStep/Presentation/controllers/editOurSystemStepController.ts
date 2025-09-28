import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type OurSystemStepModel from '../../Data/models/OurSystemStepModel'
import EditOurSystemStepUseCase from '../../Domain/useCase/editOurSystemStepUseCase'

export default class EditOurSystemStepController extends ControllerInterface<OurSystemStepModel> {
  private static instance: EditOurSystemStepController

  private constructor() {
    super()
  }

  private EditOurSystemStepUseCase = new EditOurSystemStepUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditOurSystemStepController()
    }
    return this.instance
  }

  async editOurSystemStep(params: Params, router: any) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<OurSystemStepModel> = await this.EditOurSystemStepUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.message,
          imageElement: successImage,
          messageContent: null,
        })
        await router.push('/admin/our-system-step')
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
