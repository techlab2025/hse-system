import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import DeleteHazardUseCase from '../../Domain/useCase/deleteHazardUseCase'
import type HazardModel from '../../Data/models/hazardModel'

export default class DeleteHazardController extends ControllerInterface<HazardModel> {
  private static instance: DeleteHazardController
  private constructor() {
    super()
  }
  private DeleteHazardUseCase = new DeleteHazardUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteHazardController()
    }
    return this.instance
  }

  async deleteHazard(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<HazardModel> =
        await this.DeleteHazardUseCase.call(params)

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
