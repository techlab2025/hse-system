import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type InspectionModel from '../../Data/models/InspectionModel'
import DeleteInspectionUseCase from '../../Domain/useCase/deleteInspectionUseCase'

export default class DeleteInspectionController extends ControllerInterface<InspectionModel> {
  private static instance: DeleteInspectionController
  private constructor() {
    super()
  }
  private DeleteInspectionUseCase = new DeleteInspectionUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteInspectionController()
    }
    return this.instance
  }

  async deleteInspection(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<InspectionModel> =
        await this.DeleteInspectionUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        // useLoaderStore().endLoadingWithDialog();
      } else {
        throw new Error('Error while addServices')
      }
    } catch (error: any) {
      console.log(error)
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog',
        titleContent: this.state.value.message,
        imageElement: errorImage,
        messageContent: null,
      })
    }
    super.handleResponseDialogs()
    return this.state
  }
}
