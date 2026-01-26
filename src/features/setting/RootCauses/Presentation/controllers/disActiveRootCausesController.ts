import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import RootCausesModel from '@/features/setting/RootCauses/Data/models/RootCausesModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
// import disActiveRootCausesUseCase from '@/features/setting/RootCauses/Domain/useCase/disActiveRootCausesUseCase'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'

export default class disActiveRootCausesController extends ControllerInterface<RootCausesModel> {
  private static instance: disActiveRootCausesController
  private constructor() {
    super()
  }
  private disActiveRootCausesUseCase = new disActiveRootCausesUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new disActiveRootCausesController()
    }
    return this.instance
  }

  async disActiveRootCauses(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<RootCausesModel> =
      await this.disActiveRootCausesUseCase.call(params)

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
