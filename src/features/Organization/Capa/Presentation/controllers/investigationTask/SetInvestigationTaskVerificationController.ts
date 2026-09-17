import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import SetInvestigationTaskVerificationUseCase from '../../../Domain/useCase/InvestigationTask/SetInvestigationTaskVerificationUseCase'

export default class SetInvestigationTaskVerificationController extends SelectControllerInterface<void> {
  private static instance: SetInvestigationTaskVerificationController
  private readonly useCase = new SetInvestigationTaskVerificationUseCase()

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new SetInvestigationTaskVerificationController()
    return this.instance
  }

  async getData(params: Params) {
    this.setLoading()
    const state: DataState<void> = await this.useCase.call(params)
    this.setState(state)

    if (this.isDataSuccess()) {
      DialogSelector.instance.successDialog.openDialog({
        dialogName: 'dialog-success',
        titleContent: 'Verification saved successfully',
        imageElement: successImage,
        messageContent: null,
      })
    } else {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog-error',
        titleContent: this.state.value.error?.title ?? 'Unable to save verification',
        imageElement: errorImage,
        messageContent: null,
      })
    }

    return this.state
  }
}
