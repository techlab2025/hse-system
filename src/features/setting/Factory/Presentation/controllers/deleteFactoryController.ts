import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type FactoryModel from '../../Data/models/FactoryModel'
import DeleteFactoryUseCase from '../../Domain/useCase/deleteFactoryUseCase'

export default class DeleteFactoryController extends ControllerInterface<FactoryModel> {
  private static instance: DeleteFactoryController
  private constructor() {
    super()
  }
  private DeleteFactoryUseCase = new DeleteFactoryUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteFactoryController()
    }
    return this.instance
  }

  async deleteFactory(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<FactoryModel> =
        await this.DeleteFactoryUseCase.call(params)

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
