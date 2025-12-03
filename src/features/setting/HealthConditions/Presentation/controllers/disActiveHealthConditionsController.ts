import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import HealthConditionsModel from '@/features/setting/HealthConditions/Data/models/healthConditionsModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import disActiveHealthConditionsUseCase from '@/features/setting/HealthConditions/Domain/useCase/disHealthConditionsUseCase'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'

export default class disActiveHealthConditionsController extends ControllerInterface<HealthConditionsModel> {
  private static instance: disActiveHealthConditionsController
  private constructor() {
    super()
  }
  private disActiveHealthConditionsUseCase = new disActiveHealthConditionsUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new disActiveHealthConditionsController()
    }
    return this.instance
  }

  async disActiveHealthConditions(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<HealthConditionsModel> =
      await this.disActiveHealthConditionsUseCase.call(params)

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
