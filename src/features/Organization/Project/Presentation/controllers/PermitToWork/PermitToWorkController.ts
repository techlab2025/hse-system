import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import PermitToWorkUseCase from '../../../Domain/useCase/PermitToWork/PermitToWorkUseCase'
import type ProjectModel from '../../../Data/models/ProjectModel'
import { useUserStore } from '@/stores/user'
import { EmployeeStatusEnum } from '@/features/Organization/OrganizationEmployee/Core/Enum/EmployeeStatus'

export default class PermitToWorkController extends ControllerInterface<ProjectModel> {
  private static instance: PermitToWorkController
  private constructor() {
    super()
  }
  private permitToWorkUseCase = new PermitToWorkUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new PermitToWorkController()
    }
    return this.instance
  }

  async PermitToWork(params: Params, router: Router, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const dataState: DataState<ProjectModel> = await this.permitToWorkUseCase.call(params)
      this.setState(dataState)
      const { user } = useUserStore()
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })
        // if (!draft) await router.push('/organization/project-details')
        if (user?.employeeType == EmployeeStatusEnum.Admin) {
          await router.push(`/organization/project-details/${params.toMap().project_id}`)
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
