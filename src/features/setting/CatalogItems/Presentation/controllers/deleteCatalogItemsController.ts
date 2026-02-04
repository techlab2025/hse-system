import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import successImage from '@/assets/images/Success.png'
import DeleteCatalogItemsUseCase from '../../Domain/useCase/deleteCatalogItemsUseCase'
import type CatalogItemsModel from '../../Data/models/CatalogItemsModel'

export default class DeleteCatalogItemsController extends ControllerInterface<CatalogItemsModel> {
  private static instance: DeleteCatalogItemsController
  private constructor() {
    super()
  }
  private deleteCatalogItemsUseCase = new DeleteCatalogItemsUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteCatalogItemsController()
    }
    return this.instance
  }

  async deleteCatalogItems(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<CatalogItemsModel> = await this.deleteCatalogItemsUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'deleted was successful',
          imageElement: successImage,
          messageContent: null,
        })

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
