import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'

import OrganizationEmployeeDefaultProjectRepoUseCase from '../../Domain/use_case/OrganizationEmployeeDefaultProjectRepoUseCase'
import type UserModel from '../../Data/models/user_model'

export default class OrganizationEmployeeDefaultProjectRepoController extends ControllerInterface<UserModel> {
  private static instance: OrganizationEmployeeDefaultProjectRepoController
  private constructor() {
    super()
  }
  private organizationEmployeeDefaultProjectRepoUseCase =
    new OrganizationEmployeeDefaultProjectRepoUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new OrganizationEmployeeDefaultProjectRepoController()
    }
    return this.instance
  }

  async SetorganizationEmployeeDefaultProject(
    params: Params,
    router: Router,
    draft: boolean = false,
  ) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const dataState: DataState<UserModel> =
        await this.organizationEmployeeDefaultProjectRepoUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })
        location.reload()
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
