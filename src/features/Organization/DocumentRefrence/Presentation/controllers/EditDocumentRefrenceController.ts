import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type DocumentRefrenceModel from '../../Data/models/DocumentRefrenceModel'
import EditDocumentRefrenceUseCase from '../../Domain/useCase/EditDocumentRefrenceUseCase'
import type { Router } from 'vue-router'
import type EditDocumentRefrenceParams from '../../Core/params/EditDocumentRefrenceParams'

export default class EditDocumentRefrenceController extends ControllerInterface<DocumentRefrenceModel> {
  private static instance: EditDocumentRefrenceController

  private constructor() {
    super()
  }

  private EditDocumentRefrenceUseCase = new EditDocumentRefrenceUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditDocumentRefrenceController()
    }
    return this.instance
  }

  async editDocumentRefrence(params: EditDocumentRefrenceParams, router?: Router) {
    try {
      const dataState: DataState<DocumentRefrenceModel> =
        await this.EditDocumentRefrenceUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: this.state.value.message,
          imageElement: successImage,
          messageContent: null,
        })
        router?.push({ name: 'DocumentRefrence' })
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog-error',
          titleContent: this.state.value.error?.title ?? 'Ann Error Occurred',
          imageElement: errorImage,
          messageContent: null,
        })
      }
    } catch (error: any) {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog-error',
        titleContent: this.state.value.message,
        imageElement: errorImage,
        messageContent: null,
      })
    }
    return this.state
  }
}
