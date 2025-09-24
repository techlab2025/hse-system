import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type LocationModel from '../../Data/models/LocationModel'
import DeleteLocationUseCase from '../../Domain/useCase/deleteLocationUseCase'

export default class DeleteLocationController extends ControllerInterface<LocationModel> {
  private static instance: DeleteLocationController
  private constructor() {
    super()
  }
  private deleteLocationUseCase = new DeleteLocationUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteLocationController()
    }
    return this.instance
  }

  async deleteLocation(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<LocationModel> =
        await this.deleteLocationUseCase.call(params)

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
