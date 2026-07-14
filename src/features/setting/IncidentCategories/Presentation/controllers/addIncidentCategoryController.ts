import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type IncidentCategoryModel from '../../Data/models/IncidentCategoryModel'
import AddIncidentCategoryUseCase from '../../Domain/useCase/addIncidentCategoryUseCase'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { useUserStore } from '@/stores/user'
import type AddIncidentCategoryParams from '../../Core/params/addIncidentCategoryParams'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'

export default class AddIncidentCategoryController extends ControllerInterface<IncidentCategoryModel> {
  private static instance: AddIncidentCategoryController
  private constructor() {
    super()
  }
  private addIncidentCategoryUseCase = new AddIncidentCategoryUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddIncidentCategoryController()
    }
    return this.instance
  }

  async addIncidentCategory(params: any, router: Router, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      if (params?.data?.length > 0) {
        for (const el of params.data) {
          if (!el.title) {
            new OpenWarningDilaog('title Is Required').openDialog()
            return
          }
        }
      } else {
        params.validate()
        if (!params.validate().isValid) {
          params.validateOrThrow()
          return
        }
      }
      const dataState: DataState<IncidentCategoryModel> =
        await this.addIncidentCategoryUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })

        const { user } = useUserStore()

        // if (!draft)
        //   await router.push(
        //     `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/incident-category`,
        //   )

        if (
          !router.currentRoute.value.path.includes('equipment-mangement') &&
          !router.currentRoute.value.path.includes('project-progress')
        ) {
          if (!draft)
            await router.push(
              `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/incident-category`,
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
