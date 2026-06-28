import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type DocumentRefrenceModel from '../../Data/models/DocumentRefrenceModel'
import DeleteDocumentRefrenceUseCase from '../../Domain/useCase/DeleteDocumentRefrenceUseCase'

export default class DeleteDocumentRefrenceController extends ControllerInterface<DocumentRefrenceModel> {
  private static instance: DeleteDocumentRefrenceController
  private constructor() {
    super()
  }
  private DeleteDocumentRefrenceUseCase = new DeleteDocumentRefrenceUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteDocumentRefrenceController()
    }
    return this.instance
  }

  async deleteDocumentRefrence(params: Params) {
    try {
      const dataState: DataState<DocumentRefrenceModel> =
        await this.DeleteDocumentRefrenceUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
      } else {
        throw new Error('Error while addServices')
      }
    } catch (error: any) {
      console.log(error)
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog-error',
        titleContent: this.state.value.message,
        imageElement: errorImage,
        messageContent: null,
      })
    }
    super.handleResponseDialogs()
    return this.state
  }
}
