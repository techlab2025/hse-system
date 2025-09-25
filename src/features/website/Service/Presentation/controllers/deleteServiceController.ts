import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type ServiceModel from '../../Data/models/ServiceModel'
import DeleteServiceUseCase from '../../Domain/useCase/deleteServiceUseCase'

export default class DeleteServiceController extends ControllerInterface<ServiceModel> {
  private static instance: DeleteServiceController
  private constructor() {
    super()
  }
  private DeleteServiceUseCase = new DeleteServiceUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteServiceController()
    }
    return this.instance
  }

  async deleteService(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<ServiceModel> = await this.DeleteServiceUseCase.call(params)

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
