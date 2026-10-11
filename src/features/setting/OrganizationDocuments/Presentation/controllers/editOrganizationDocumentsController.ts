import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type OrganizationDocumentsModel from '../../Data/models/OrganizationDocumentsModel'
import EditOrganizationDocumentsUseCase from '../../Domain/useCase/editOrganizationDocumentsUseCase'

export default class EditOrganizationDocumentsController extends ControllerInterface<OrganizationDocumentsModel> {
  private static instance: EditOrganizationDocumentsController

  private constructor() {
    super()
  }

  private EditOrganizationDocumentsUseCase = new EditOrganizationDocumentsUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditOrganizationDocumentsController()
    }
    return this.instance
  }

  async editOrganizationDocuments(params: Params, router: any) {
    try {
      const dataState: DataState<OrganizationDocumentsModel> =
        await this.EditOrganizationDocumentsUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: this.state.value.message,
          imageElement: successImage,
          messageContent: null,
        })
        await router.push('/organization/organization-documents')
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
