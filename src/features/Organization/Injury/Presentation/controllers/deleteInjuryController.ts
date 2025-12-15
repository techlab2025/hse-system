import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type InjuryModel from '../../Data/models/InjuryModel'
import DeleteInjuryUseCase from '../../Domain/useCase/deleteInjuryUseCase'

export default class DeleteInjuryController extends ControllerInterface<InjuryModel> {
  private static instance: DeleteInjuryController
  private constructor() {
    super()
  }
  private DeleteInjuryUseCase = new DeleteInjuryUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteInjuryController()
    }
    return this.instance
  }

  async deleteInjury(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<InjuryModel> =
        await this.DeleteInjuryUseCase.call(params)

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
