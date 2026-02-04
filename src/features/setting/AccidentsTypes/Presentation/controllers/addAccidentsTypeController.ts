import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type AccidentsTypeModel from '../../Data/models/AccidentsTypeModel'
import AddAccidentsTypeUseCase from '../../Domain/useCase/addAccidentsTypeUseCase'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { useUserStore } from '@/stores/user'
import type AddAccidentsTypeParams from '../../Core/params/addAccidentsTypeParams'

export default class AddAccidentsTypeController extends ControllerInterface<AccidentsTypeModel> {
  private static instance: AddAccidentsTypeController
  private constructor() {
    super()
  }
  private addAccidentsTypeUseCase = new AddAccidentsTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddAccidentsTypeController()
    }
    return this.instance
  }

  async addAccidentsType(params: AddAccidentsTypeParams, router: Router, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      params.validate()

      if (!params.validate().isValid) {
        params.validateOrThrow()
        return
      }
      const dataState: DataState<AccidentsTypeModel> =
        await this.addAccidentsTypeUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })

        const { user } = useUserStore()

        // if (!draft)
        //   await router.push(
        //     `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/accidents-type`,
        //   )

        if (
          !router.currentRoute.value.path.includes('equipment-mangement') &&
          !router.currentRoute.value.path.includes('project-progress')
        ) {
          if (!draft)
            await router.push(
              `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/accidents-type`,
            )
        }

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
