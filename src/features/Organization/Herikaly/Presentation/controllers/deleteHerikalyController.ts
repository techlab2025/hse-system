import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type HerikalyModel from '../../Data/models/HerikalyModel'
import DeleteHerikalyUseCase from '../../Domain/useCase/deleteHerikalyUseCase'




export default class DeleteHerikalyController extends ControllerInterface<HerikalyModel> {
  private static instance: DeleteHerikalyController
  private constructor() {
    super()
  }
  private DeleteHerikalyUseCase = new DeleteHerikalyUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteHerikalyController()
    }
    return this.instance
  }

  async deleteHerikaly(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<HerikalyModel> =
        await this.DeleteHerikalyUseCase.call(params)

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
