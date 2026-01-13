import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type EmployeeCertificateModel from '../../Data/models/EmployeeCertificateModel'
import AddEmployeeCertificateteUseCase from '../../Domain/useCase/addEmployeeCertificateUseCase'
import type AddEmployeeCertificateParams from '../../Core/params/AddEmplyeeCertificateParams'

export default class AddEmployeeCertificateController extends ControllerInterface<EmployeeCertificateModel> {
  private static instance: AddEmployeeCertificateController
  private constructor() {
    super()
  }
  private AddEmployeeCertificateUseCase = new AddEmployeeCertificateteUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddEmployeeCertificateController()
    }
    return this.instance
  }

  async addEmployeeCertificate(
    params: AddEmployeeCertificateParams,
    router: Router,
    draft: boolean = false,
  ) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      params.validate()
      if (!params.validate()?.isValid) {
        params.validateOrThrow()
        return
      }
      const dataState: DataState<EmployeeCertificateModel> =
        await this.AddEmployeeCertificateUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })
        if (!draft) await router.push('/organization/employee-certificate')

        // useLoaderStore().endLoadingWithDialog();
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.error?.title ?? 'Ann Error Occurred',
          imageElement: errorImage,
          messageContent: null,
        })
      }
    } catch (error: unknown) {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog',
        titleContent: this.state.value.error?.title ?? (error as string),
        imageElement: errorImage,
        messageContent: null,
      })
    }

    super.handleResponseDialogs()
    return this.state
  }
}
