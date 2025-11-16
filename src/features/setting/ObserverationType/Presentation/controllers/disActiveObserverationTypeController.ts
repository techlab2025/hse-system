import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import ObserverationTypeModel from '@/features/setting/ObserverationType/Data/models/observerationTypeModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import disActiveObserverationTypeUseCase from '@/features/setting/ObserverationType/Domain/useCase/disObserverationTypeUseCase'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'

export default class disActiveObserverationTypeController extends ControllerInterface<ObserverationTypeModel> {
  private static instance: disActiveObserverationTypeController
  private constructor() {
    super()
  }
  private disActiveObserverationTypeUseCase = new disActiveObserverationTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new disActiveObserverationTypeController()
    }
    return this.instance
  }

  async disActiveObserverationType(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<ObserverationTypeModel> =
      await this.disActiveObserverationTypeUseCase.call(params)

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
