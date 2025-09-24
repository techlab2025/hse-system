import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type AccidentsTypeModel from '../../Data/models/AccidentsTypeModel'
import DeleteAccidentsTypeUseCase from '../../Domain/useCase/deleteAccidentsTypeUseCase'
import successImage from '@/assets/images/Success.png'

export default class DeleteAccidentsTypeController extends ControllerInterface<AccidentsTypeModel> {
  private static instance: DeleteAccidentsTypeController
  private constructor() {
    super()
  }
  private deleteAccidentsTypeUseCase = new DeleteAccidentsTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteAccidentsTypeController()
    }
    return this.instance
  }

  async deleteAccidentsType(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<AccidentsTypeModel> =
        await this.deleteAccidentsTypeUseCase.call(params)

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
