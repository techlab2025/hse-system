import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type DocumentRefrenceModel from '../../Data/models/DocumentRefrenceModel'
import AddDocumentRefrenceUseCase from '../../Domain/useCase/AddDocumentRefrenceUseCase'
import type AddDocumentRefrenceParams from '../../Core/params/AddDocumentRefrenceParams'
import type { Router } from 'vue-router'

export default class AddDocumentRefrenceController extends ControllerInterface<DocumentRefrenceModel> {
  private static instance: AddDocumentRefrenceController
  private constructor() {
    super()
  }
  private AddDocumentRefrenceUseCase = new AddDocumentRefrenceUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddDocumentRefrenceController()
    }
    return this.instance
  }

  async addDocumentRefrence(params: AddDocumentRefrenceParams, router?: Router) {
    try {
      const dataState: DataState<DocumentRefrenceModel> =
        await this.AddDocumentRefrenceUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: 'Added was successful',
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
    } catch (error: unknown) {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog-error',
        titleContent: this.state.value.error?.title ?? (error as string),
        imageElement: errorImage,
        messageContent: null,
      })
    }

    super.handleResponseDialogs()
    return this.state
  }
}
