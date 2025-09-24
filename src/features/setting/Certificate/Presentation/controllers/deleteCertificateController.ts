import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type CertificateModel from '../../Data/models/CertificateModel'
import DeleteCertificateUseCase from '../../Domain/useCase/deleteCertificateUseCase'

export default class DeleteCertificateController extends ControllerInterface<CertificateModel> {
  private static instance: DeleteCertificateController
  private constructor() {
    super()
  }
  private DeleteCertificateUseCase = new DeleteCertificateUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteCertificateController()
    }
    return this.instance
  }

  async deleteCertificate(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<CertificateModel> =
        await this.DeleteCertificateUseCase.call(params)

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
