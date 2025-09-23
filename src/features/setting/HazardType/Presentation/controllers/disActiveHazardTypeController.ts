import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import HazardTypeModel from '@/features/setting/HazardType/Data/models/hazardTypeModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import disActiveHazardTypeUseCase from '@/features/setting/HazardType/Domain/useCase/disHazardTypeUseCase'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/Error.png'

export default class disActiveHazardTypeController extends ControllerInterface<HazardTypeModel> {
  private static instance: disActiveHazardTypeController
  private constructor() {
    super()
  }
  private disActiveHazardTypeUseCase = new disActiveHazardTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new disActiveHazardTypeController()
    }
    return this.instance
  }

  async disActiveHazardType(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<HazardTypeModel> =
      await this.disActiveHazardTypeUseCase.call(params)

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
