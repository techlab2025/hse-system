import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type SystemComponentModel from '../../Data/models/SystemComponentModel'
import DisSystemComponentUseCase from '../../Domain/useCase/disSystemComponentUseCase'

export default class disActiveSystemComponentController extends ControllerInterface<SystemComponentModel> {
  private static instance: disActiveSystemComponentController
  private constructor() {
    super()
  }
  private disSystemComponentUseCase = new DisSystemComponentUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new disActiveSystemComponentController()
    }
    return this.instance
  }

  async disActiveSystemComponent(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<SystemComponentModel> =
      await this.disSystemComponentUseCase.call(params)

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
