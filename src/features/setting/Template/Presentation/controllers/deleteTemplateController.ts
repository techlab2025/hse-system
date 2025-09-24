import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type TemplateModel from '../../Data/models/TemplateModel'
import DeleteTemplateUseCase from '../../Domain/useCase/deleteTemplateUseCase'

export default class DeleteTemplateController extends ControllerInterface<TemplateModel> {
  private static instance: DeleteTemplateController
  private constructor() {
    super()
  }
  private DeleteTemplateUseCase = new DeleteTemplateUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteTemplateController()
    }
    return this.instance
  }

  async deleteTemplate(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<TemplateModel> =
        await this.DeleteTemplateUseCase.call(params)

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
