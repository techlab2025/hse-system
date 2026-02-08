import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import successImage from '@/assets/images/Success.png'
import DeleteCatalogItemsDetailsUseCase from '../../Domain/useCase/deleteCatalogItemsDetailsUseCase'
import type CatalogItemsModel from '../../Data/models/CatalogItemsModel'

export default class DeleteCatalogItemsDetailsController extends ControllerInterface<CatalogItemsModel> {
  private static instance: DeleteCatalogItemsDetailsController
  private constructor() {
    super()
  }
  private deleteCatalogItemsDetailsUseCase = new DeleteCatalogItemsDetailsUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteCatalogItemsDetailsController()
    }
    return this.instance
  }

  async deleteCatalogItemsDetails(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<CatalogItemsModel> = await this.deleteCatalogItemsDetailsUseCase.call(params)

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
