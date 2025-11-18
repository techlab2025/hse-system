import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import ObservationModel from '@/features/setting/Observation/Data/models/observationModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import disActiveObservationUseCase from '@/features/setting/Observation/Domain/useCase/disObservationUseCase'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'

export default class disActiveObservationController extends ControllerInterface<ObservationModel> {
  private static instance: disActiveObservationController
  private constructor() {
    super()
  }
  private disActiveObservationUseCase = new disActiveObservationUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new disActiveObservationController()
    }
    return this.instance
  }

  async disActiveObservation(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<ObservationModel> =
      await this.disActiveObservationUseCase.call(params)

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
