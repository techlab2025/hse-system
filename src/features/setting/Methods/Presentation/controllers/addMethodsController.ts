import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import type MethodsModel from '../../Data/models/MethodModel'
import AddMethodsUseCase from '../../Domain/useCase/addMethodsUseCase'

export default class AddMethodsController extends ControllerInterface<MethodsModel> {
  private static instance: AddMethodsController
  private constructor() {
    super()
  }
  private AddMethodsUseCase = new AddMethodsUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddMethodsController()
    }
    return this.instance
  }

  async addMethods(params: Params, router: Router, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    try {

      const dataState: DataState<MethodsModel> =
        await this.AddMethodsUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })

        const { user } = useUserStore()


        if (!draft) await router.push(`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/methods`)

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
