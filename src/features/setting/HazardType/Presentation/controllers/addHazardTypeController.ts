import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import AddHazardTypeUseCase from '@/features/setting/HazardType/Domain/useCase/addHazardTypeUseCase'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import { useRoute, type Router } from 'vue-router'
import type HazardTypeModel from '@/features/setting/HazardType/Data/models/hazardTypeModel'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import type AddHazardTypeParams from '../../Core/params/addHazardTypeParams'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'

export default class AddHazardTypeController extends ControllerInterface<HazardTypeModel> {
  private static instance: AddHazardTypeController
  private constructor() {
    super()
  }
  private AddHazardTypeUseCase = new AddHazardTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddHazardTypeController()
    }
    return this.instance
  }

  async addHazardType(params: AddHazardTypeParams, router: Router, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      params.validate()

      if (!params.validate().isValid) {
        params.validateOrThrow()
        return
      }

      const dataState: DataState<HazardTypeModel> = await this.AddHazardTypeUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })

        const { user } = useUserStore()

        const route = useRoute()

        await router.push(
          params?.ParentId
            ? `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/hazard-type/${params?.ParentId}/hazards`
            : `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/hazard-type`,
        )
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
