import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import AddEquipmentTypeUseCase from '@/features/setting/EquipmentType/Domain/useCase/addEquipmentTypeUseCase'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type RootCausesModel from '@/features/setting/RootCauses/Data/models/RootCausesModel'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { useUserStore } from '@/stores/user'
import type AddRootCausesParams from '../../Core/params/addRootCausesParams'
import AddRootCausesUseCase from '../../Domain/useCase/addRootCausesUseCase'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'
import AddSystemRootCausesUseCase from '../../Domain/useCase/addSystemRootCausesUseCase'

export default class AddSystemRootCausesController extends ControllerInterface<RootCausesModel> {
  private static instance: AddSystemRootCausesController
  private constructor() {
    super()
  }
  private AddSystemRootCausesUseCase = new AddSystemRootCausesUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddSystemRootCausesController()
    }
    return this.instance
  }

  async addSystemRootCauses(params: any, router: Router, draft: boolean = false) {
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
      const dataState: DataState<RootCausesModel> = await this.AddSystemRootCausesUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })

        const { user } = useUserStore()

        if (!draft)
          if (router.currentRoute?.value.fullPath.includes('root-causes')) {
            await router.push(
              `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/root-causes`,
            )
          } else {
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
