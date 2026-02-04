import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import AddObserverationTypeUseCase from '@/features/setting/ObserverationType/Domain/useCase/addObserverationTypeUseCase'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type ObserverationTypeModel from '@/features/setting/ObserverationType/Data/models/observerationTypeModel'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'

export default class AddObserverationTypeController extends ControllerInterface<ObserverationTypeModel> {
  private static instance: AddObserverationTypeController
  private constructor() {
    super()
  }
  private AddObserverationTypeUseCase = new AddObserverationTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddObserverationTypeController()
    }
    return this.instance
  }

  async addObserverationType(params: Params, router: Router, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      console.log('Ssssssss')
      const dataState: DataState<ObserverationTypeModel> =
        await this.AddObserverationTypeUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })

        const { user } = useUserStore()

        if (
          !router.currentRoute.value.path.includes('/equipment-mangement/observation') &&
          !router.currentRoute.value.path.includes('/project-progress')
        )
          if (!draft)
            await router.push(
              `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/observation-type`,
            )

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
