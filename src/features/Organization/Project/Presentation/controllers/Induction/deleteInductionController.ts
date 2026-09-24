import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type InductionModel from '../../../Data/models/Induction/InductionModel'
import DeleteInductionUseCase from '../../../Domain/useCase/Induction/deleteInductionUseCase'

export default class DeleteInductionController extends ControllerInterface<InductionModel> {
  private static instance: DeleteInductionController
  private readonly useCase = new DeleteInductionUseCase()

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new DeleteInductionController()
    return this.instance
  }

  async deleteInduction(params: Params) {
    try {
      this.setLoading()
      const dataState: DataState<InductionModel> = await this.useCase.call(params)
      this.setState(dataState)

      if (!this.isDataSuccess()) throw new Error('Error while addServices')
    } catch (error: unknown) {
      console.log(error)
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog-error',
        titleContent: this.state.value.message,
        imageElement: errorImage,
        messageContent: null,
      })
    }

    super.handleResponseDialogs()
    return this.state
  }
}
