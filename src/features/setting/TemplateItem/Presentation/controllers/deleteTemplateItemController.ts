import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import DeleteTemplateItemUseCase from '../../Domain/useCase/deleteTemplateItemUseCase'
import type TemplateItemModel from '../../Data/models/TemplateItemModel'
import successImage from '@/assets/images/Success.png'

export default class DeleteTemplateItemController extends ControllerInterface<TemplateItemModel> {
  private static instance: DeleteTemplateItemController
  private constructor() {
    super()
  }
  private deleteTemplateItemUseCase = new DeleteTemplateItemUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteTemplateItemController()
    }
    return this.instance
  }

  async deleteTemplateItem(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<TemplateItemModel> = await this.deleteTemplateItemUseCase.call(params)

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
