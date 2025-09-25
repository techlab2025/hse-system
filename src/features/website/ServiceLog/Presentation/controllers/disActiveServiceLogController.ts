import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type ServiceLogModel from '../../Data/models/ServiceLogModel'
import DisServiceLogUseCase from '../../Domain/useCase/disServiceLogUseCase'

export default class disActiveServiceLogController extends ControllerInterface<ServiceLogModel> {
  private static instance: disActiveServiceLogController
  private constructor() {
    super()
  }
  private disServiceLogUseCase = new DisServiceLogUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new disActiveServiceLogController()
    }
    return this.instance
  }

  async disActiveServiceLog(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<ServiceLogModel> =
      await this.disServiceLogUseCase.call(params)

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
