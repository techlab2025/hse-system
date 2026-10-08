import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type OrganizationDocumentsModel from '../../Data/models/OrganizationDocumentsModel'
import DisOrganizationDocumentsUseCase from '../../Domain/useCase/disActiveOrganizationDocumentsUseCase'

export default class DisActiveOrganizationDocumentsController extends ControllerInterface<OrganizationDocumentsModel> {
  private static instance: DisActiveOrganizationDocumentsController
  private constructor() {
    super()
  }
  private disActiveOrganizationDocumentsUseCase = new DisOrganizationDocumentsUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DisActiveOrganizationDocumentsController()
    }
    return this.instance
  }

  async disActiveOrganizationDocuments(params: Params) {
    this.setLoading()
    const dataState: DataState<OrganizationDocumentsModel> =
      await this.disActiveOrganizationDocumentsUseCase.call(params)

    this.setState(dataState)
    if (this.isDataSuccess()) {
      DialogSelector.instance.successDialog.openDialog({
        dialogName: 'dialog-success',
        titleContent: this.state.value.message,
        imageElement: successImage,
        messageContent: null,
      })
    } else {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog-error',
        titleContent: this.state.value.error?.title! ?? 'Ann Error Occurred',
        imageElement: errorImage,
        messageContent: null,
      })
      throw new Error('Unable to load documents')
    }
    super.handleResponseDialogs()
    return this.state
  }
}
