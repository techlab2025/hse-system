import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type IncidentCategoryModel from '../../Data/models/IncidentCategoryModel'
import DeleteIncidentCategoryUseCase from '../../Domain/useCase/deleteIncidentCategoryUseCase'
import successImage from '@/assets/images/Success.png'

export default class DeleteIncidentCategoryController extends ControllerInterface<IncidentCategoryModel> {
  private static instance: DeleteIncidentCategoryController
  private constructor() {
    super()
  }
  private deleteIncidentCategoryUseCase = new DeleteIncidentCategoryUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteIncidentCategoryController()
    }
    return this.instance
  }

  async deleteIncidentCategory(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<IncidentCategoryModel> =
        await this.deleteIncidentCategoryUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: 'deleted was successful',
          imageElement: successImage,
          messageContent: null,
        })
        // useLoaderStore().endLoadingWithDialog();
      } else {
        throw new Error('Error while addServices')
      }
    } catch (error: any) {
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
