import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type VisitCategoryModel from '../../Data/models/VisitCategoryModel'
import DeleteVisitCategoryUseCase from '../../Domain/useCase/deleteVisitCategoryUseCase'

export default class DeleteVisitCategoryController extends ControllerInterface<VisitCategoryModel> {
  private static instance: DeleteVisitCategoryController
  private readonly useCase = new DeleteVisitCategoryUseCase()
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) this.instance = new DeleteVisitCategoryController()
    return this.instance
  }
  async deleteVisitCategory(params: Params) {
    try {
      const dataState: DataState<VisitCategoryModel> = await this.useCase.call(params)
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
