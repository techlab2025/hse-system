import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type OurSystemStepModel from '../../Data/models/OurSystemStepModel'
import ChangeStatusOurSystemStepUseCase from '../../Domain/useCase/changeStatusOurSystemStepUseCase'





export default class ChangeStatusOurSystemStepController extends ControllerInterface<OurSystemStepModel> {
  private static instance: ChangeStatusOurSystemStepController
  private constructor() {
    super()
  }
  private ChangeStatusOurSystemStepUseCase = new ChangeStatusOurSystemStepUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ChangeStatusOurSystemStepController()
    }
    return this.instance
  }

  async changeStatusOurSystemStep(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<OurSystemStepModel> =
      await this.ChangeStatusOurSystemStepUseCase.call(params)

    this.setState(dataState)
    if (this.isDataSuccess()) {
      DialogSelector.instance.successDialog.openDialog({
        dialogName: 'dialog',
        titleContent: this.state.value.message,
        imageElement: successImage,
        messageContent: null,
      })
      // useLoaderStore().endLoadingWithDialog();
    } else {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog',
        titleContent: this.state.value.error?.title! ?? 'Ann Error Occurred',
        imageElement: errorImage,
        messageContent: null,
      })
      throw new Error('Error while addServices')
    }
    super.handleResponseDialogs()
    return this.state
  }
}
