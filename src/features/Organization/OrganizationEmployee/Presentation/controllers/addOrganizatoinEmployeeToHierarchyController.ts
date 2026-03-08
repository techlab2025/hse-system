import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type OrganizatoinEmployeeModel from '../../Data/models/OrganizatoinEmployeeModel'
import AddOrganizatoinEmployeeToHierarchyUseCase from '../../Domain/useCase/addOrganizatoinEmployeeToHierarchyUseCase'

export default class AddOrganizatoinEmployeeToHierarchyController extends ControllerInterface<OrganizatoinEmployeeModel> {
  private static instance: AddOrganizatoinEmployeeToHierarchyController
  private constructor() {
    super()
  }
  private addOrganizatoinEmployeeToHierarchyUseCase =
    new AddOrganizatoinEmployeeToHierarchyUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddOrganizatoinEmployeeToHierarchyController()
    }
    return this.instance
  }

  async addOrganizatoinEmployeeToHiearcrhy(params: any, router: Router, draft: boolean = false) {
    params.validate()
    if (!params.validate().isValid) {
      params.validateOrThrow()
      return
    }
    try {
      const dataState: DataState<OrganizatoinEmployeeModel> =
        await this.addOrganizatoinEmployeeToHierarchyUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })
        // if (
        //   router.currentRoute.value.fullPath.includes('organization-employee') &&
        //   !router.currentRoute.value.fullPath.includes('project-progress')
        // ) {
        //   if (!draft) await router.push('/organization/organization-employee')
        // }

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
