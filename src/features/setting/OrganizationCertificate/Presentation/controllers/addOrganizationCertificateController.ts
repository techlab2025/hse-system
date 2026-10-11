import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type OrganizationCertificateModel from '../../Data/models/OrganizationCertificateModel'
import AddOrganizationCertificateUseCase from '../../Domain/useCase/addOrganizationCertificateUseCase'

export default class AddOrganizationCertificateController extends ControllerInterface<OrganizationCertificateModel> {
  private static instance: AddOrganizationCertificateController
  private constructor() {
    super()
  }
  private AddOrganizationCertificateUseCase = new AddOrganizationCertificateUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddOrganizationCertificateController()
    }
    return this.instance
  }

  async addOrganizationCertificate(params: Params, router: Router, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();

    try {
      const dataState: DataState<OrganizationCertificateModel> = await this.AddOrganizationCertificateUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })
        if (!router.currentRoute.value?.fullPath.includes('project-progress')) {
          if (!draft)
            await router.push(
              '/organization/organization-certificate',
            )
        }

        // useLoaderStore().endLoadingWithDialog();
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
