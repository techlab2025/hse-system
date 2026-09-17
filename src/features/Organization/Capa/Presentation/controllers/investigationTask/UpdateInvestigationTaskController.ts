import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import UpdateInvestigationTaskUseCase from '../../../Domain/useCase/InvestigationTask/UpdateInvestigationTaskUseCase'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'

export default class UpdateInvestigationTaskController extends SelectControllerInterface<void> {
  private static instance: UpdateInvestigationTaskController
  private constructor() {
    super()
  }
  private updateInvestigationTaskUseCase = new UpdateInvestigationTaskUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new UpdateInvestigationTaskController()
    }
    return this.instance
  }

  async getData(params: Params) {
    this.setLoading()
    const dataState: DataState<void> = await this.updateInvestigationTaskUseCase.call(params)

    this.setState(dataState)
    if (this.isDataSuccess()) {
      DialogSelector.instance.successDialog.openDialog({
        dialogName: 'dialog-success',
        titleContent: 'Added was successful',
        imageElement: successImage,
        messageContent: null,
      })
      // await router.push('/organization/investigating')
    } else {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog-error',
        titleContent: this.state.value.error?.title ?? 'Ann Error Occurred',
        imageElement: errorImage,
        messageContent: null,
      })
    }
    super.handleResponseDialogs()
    return this.state
  }
}
