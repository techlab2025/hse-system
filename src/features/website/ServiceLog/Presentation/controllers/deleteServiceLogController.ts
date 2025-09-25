import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type ServiceLogModel from '../../Data/models/ServiceLogModel'
import DeleteServiceLogUseCase from '../../Domain/useCase/deleteServiceLogUseCase'

export default class DeleteServiceLogController extends ControllerInterface<ServiceLogModel> {
  private static instance: DeleteServiceLogController
  private constructor() {
    super()
  }
  private deleteServiceLogUseCase = new DeleteServiceLogUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteServiceLogController()
    }
    return this.instance
  }

  async deleteServiceLog(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<ServiceLogModel> =
        await this.deleteServiceLogUseCase.call(params)

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
