import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type ClientOpinionModel from '../../Data/models/ClientOpinionModel'
import DeleteClientOpinionUseCase from '../../Domain/useCase/deleteClientOpinionUseCase'

export default class DeleteClientOpinionController extends ControllerInterface<ClientOpinionModel> {
  private static instance: DeleteClientOpinionController
  private constructor() {
    super()
  }
  private DeleteClientOpinionUseCase = new DeleteClientOpinionUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteClientOpinionController()
    }
    return this.instance
  }

  async deleteClientOpinion(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<ClientOpinionModel> =
        await this.DeleteClientOpinionUseCase.call(params)

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
