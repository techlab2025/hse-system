import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import DeleteObjectivesUseCase from '../../Domain/useCase/deleteObjectivesUseCase'
import successImage from '@/assets/images/Success.png'
import type ObjectivesModel from '../../Data/models/objectivesModel'

export default class DeleteObjectivesController extends ControllerInterface<ObjectivesModel> {
  private static instance: DeleteObjectivesController
  private constructor() {
    super()
  }
  private deleteObjectivesUseCase = new DeleteObjectivesUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteObjectivesController()
    }
    return this.instance
  }

  async deleteObjectives(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<ObjectivesModel> = await this.deleteObjectivesUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
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
