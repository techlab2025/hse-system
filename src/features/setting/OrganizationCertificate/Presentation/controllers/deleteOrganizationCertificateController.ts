import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type OrganizationCertificateModel from '../../Data/models/OrganizationCertificateModel'
import DeleteOrganizationCertificateUseCase from '../../Domain/useCase/deleteOrganizationCertificateUseCase'

export default class DeleteOrganizationCertificateController extends ControllerInterface<OrganizationCertificateModel> {
  private static instance: DeleteOrganizationCertificateController
  private constructor() {
    super()
  }
  private DeleteOrganizationCertificateUseCase = new DeleteOrganizationCertificateUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteOrganizationCertificateController()
    }
    return this.instance
  }

  async deleteOrganizationCertificate(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<OrganizationCertificateModel> =
        await this.DeleteOrganizationCertificateUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        // useLoaderStore().endLoadingWithDialog();
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
