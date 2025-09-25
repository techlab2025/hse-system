import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type PowerFullModel from '../../Data/models/PowerFullModel'
import DeletePowerFullUseCase from '../../Domain/useCase/deletePowerFullUseCase'



export default class DeletePowerFullController extends ControllerInterface<PowerFullModel> {
  private static instance: DeletePowerFullController
  private constructor() {
    super()
  }
  private DeletePowerFullUseCase = new DeletePowerFullUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeletePowerFullController()
    }
    return this.instance
  }

  async deletePowerFull(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<PowerFullModel> =
        await this.DeletePowerFullUseCase.call(params)

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
