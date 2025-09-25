import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type HomeContactUsModel from '../../Data/models/HomeContactUsModel'
import ChangeStatusHomeContactUsUseCase from '../../Domain/useCase/changeStatusHomeContactUsUseCase'


export default class ChangeStatusHomeContactUsController extends ControllerInterface<HomeContactUsModel> {
  private static instance: ChangeStatusHomeContactUsController
  private constructor() {
    super()
  }
  private ChangeStatusHomeContactUsUseCase = new ChangeStatusHomeContactUsUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ChangeStatusHomeContactUsController()
    }
    return this.instance
  }

  async changeStatusHomeContactUs(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<HomeContactUsModel> =
      await this.ChangeStatusHomeContactUsUseCase.call(params)

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
