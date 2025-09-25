import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type ServiceFeatureModel from '../../Data/models/ServiceFeatureModel'
import DeleteServiceFeatureUseCase from '../../Domain/useCase/deleteServiceFeatureUseCase'

export default class DeleteServiceFeatureController extends ControllerInterface<ServiceFeatureModel> {
  private static instance: DeleteServiceFeatureController
  private constructor() {
    super()
  }
  private deleteServiceFeatureUseCase = new DeleteServiceFeatureUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteServiceFeatureController()
    }
    return this.instance
  }

  async deleteServiceFeature(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<ServiceFeatureModel> =
        await this.deleteServiceFeatureUseCase.call(params)

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
