import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type SystemFeatureModel from '../../Data/models/SystemFeatureModel'
import DeleteSystemFeatureUseCase from '../../Domain/useCase/deleteSystemFeatureUseCase'

export default class DeleteSystemFeatureController extends ControllerInterface<SystemFeatureModel> {
  private static instance: DeleteSystemFeatureController
  private constructor() {
    super()
  }
  private deleteSystemFeatureUseCase = new DeleteSystemFeatureUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteSystemFeatureController()
    }
    return this.instance
  }

  async deleteSystemFeature(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<SystemFeatureModel> =
        await this.deleteSystemFeatureUseCase.call(params)

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
