import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type ServiceSectionModel from '../../Data/models/ServiceSectionModel'
import DisServiceSectionUseCase from '../../Domain/useCase/disServiceSectionUseCase'

export default class disActiveServiceSectionController extends ControllerInterface<ServiceSectionModel> {
  private static instance: disActiveServiceSectionController
  private constructor() {
    super()
  }
  private disServiceSectionUseCase = new DisServiceSectionUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new disActiveServiceSectionController()
    }
    return this.instance
  }

  async disActiveServiceSection(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<ServiceSectionModel> =
      await this.disServiceSectionUseCase.call(params)

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
