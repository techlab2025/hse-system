import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type FactoryItemModel from '@/features/setting/FactoryItem/Data/models/factoryItemModel.ts'
import DeleteFactoryItemUseCase from '@/features/setting/FactoryItem/Domain/useCase/deleteFactoryItemUseCase.ts'

export default class DeleteFactoryItemController extends ControllerInterface<FactoryItemModel> {
  private static instance: DeleteFactoryItemController
  private constructor() {
    super()
  }
  private DeleteFactoryUseCase = new DeleteFactoryItemUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteFactoryItemController()
    }
    return this.instance
  }

  async deleteFactory(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<FactoryItemModel> = await this.DeleteFactoryUseCase.call(params)

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
