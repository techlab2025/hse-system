import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type OrganizationDocumentsModel from '../../Data/models/OrganizationDocumentsModel'
import AddOrganizationDocumentsUseCase from '../../Domain/useCase/addOrganizationDocumentsUseCase'

export default class AddOrganizationDocumentsController extends ControllerInterface<OrganizationDocumentsModel> {
  private static instance: AddOrganizationDocumentsController
  private constructor() {
    super()
  }
  private AddOrganizationDocumentsUseCase = new AddOrganizationDocumentsUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddOrganizationDocumentsController()
    }
    return this.instance
  }

  async addOrganizationDocuments(params: Params, router: Router, draft: boolean = false) {
    try {
      const dataState: DataState<OrganizationDocumentsModel> =
        await this.AddOrganizationDocumentsUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })
        if (!router.currentRoute.value?.fullPath.includes('project-progress')) {
          if (!draft) await router.push('/organization/organization-documents')
        }
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
