import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type OrganizationDocumentsModel from '../../Data/models/OrganizationDocumentsModel'
import DeleteOrganizationDocumentsUseCase from '../../Domain/useCase/deleteOrganizationDocumentsUseCase'

export default class DeleteOrganizationDocumentsController extends ControllerInterface<OrganizationDocumentsModel> {
  private static instance: DeleteOrganizationDocumentsController
  private constructor() {
    super()
  }
  private DeleteOrganizationDocumentsUseCase = new DeleteOrganizationDocumentsUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteOrganizationDocumentsController()
    }
    return this.instance
  }

  async deleteOrganizationDocuments(params: Params) {
    try {
      const dataState: DataState<OrganizationDocumentsModel> =
        await this.DeleteOrganizationDocumentsUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
      } else {
        throw new Error('Unable to load documents')
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
