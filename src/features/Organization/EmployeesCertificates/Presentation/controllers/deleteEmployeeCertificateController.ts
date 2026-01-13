import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type EmployeeCertificateModel from '../../Data/models/EmployeeCertificateModel'
import DeleteEmployeeCertificateUseCase from '../../Domain/useCase/deleteEmployeeCertificateUseCase'

export default class DeleteEmployeeCertificateController extends ControllerInterface<EmployeeCertificateModel> {
  private static instance: DeleteEmployeeCertificateController
  private constructor() {
    super()
  }
  private DeleteEmployeeCertificateUseCase = new DeleteEmployeeCertificateUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteEmployeeCertificateController()
    }
    return this.instance
  }

  async deleteEmployeeCertificate(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<EmployeeCertificateModel> =
        await this.DeleteEmployeeCertificateUseCase.call(params)

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
