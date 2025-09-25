import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type CategoryModel from '../../Data/models/CategoryModel'
import DeleteCategoryUseCase from '../../Domain/useCase/deleteCategoryUseCase'

export default class DeleteCategoryController extends ControllerInterface<CategoryModel> {
  private static instance: DeleteCategoryController
  private constructor() {
    super()
  }
  private DeleteCategoryUseCase = new DeleteCategoryUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteCategoryController()
    }
    return this.instance
  }

  async deleteCategory(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<CategoryModel> =
        await this.DeleteCategoryUseCase.call(params)

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
