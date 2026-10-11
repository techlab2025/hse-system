import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type VisitActivityModel from '../../Data/models/VisitActivityModel'
import DeleteVisitActivityUseCase from '../../Domain/useCase/deleteVisitActivityUseCase'

export default class DeleteVisitActivityController extends ControllerInterface<VisitActivityModel> {
  private static instance: DeleteVisitActivityController
  private readonly deleteVisitActivityUseCase = new DeleteVisitActivityUseCase()

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new DeleteVisitActivityController()
    return this.instance
  }

  async deleteVisitActivity(params: Params) {
    try {
      const dataState: DataState<VisitActivityModel> =
        await this.deleteVisitActivityUseCase.call(params)
      this.setLoading()
      this.setState(dataState)
    } catch (error: unknown) {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog-error',
        titleContent: this.state.value.message ?? String(error),
        imageElement: errorImage,
        messageContent: null,
      })
    }
    super.handleResponseDialogs()
    return this.state
  }
}
