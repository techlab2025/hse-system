import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type OrganizationLocationModel from '../../Data/models/OrganizationLocationModel'
import AddOrganizationLocationteUseCase from '../../Domain/useCase/addOrganizationLocationUseCase'

export default class AddOrganizationLocationController extends ControllerInterface<OrganizationLocationModel> {
  private static instance: AddOrganizationLocationController
  private constructor() {
    super()
  }
  private AddOrganizationLocationUseCase = new AddOrganizationLocationteUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddOrganizationLocationController()
    }
    return this.instance
  }

  async addOrganizationLocation(params: Params, router: Router, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const dataState: DataState<OrganizationLocationModel> =
        await this.AddOrganizationLocationUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })
        if (!draft) await router.push('/organization/organization-locations')

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
