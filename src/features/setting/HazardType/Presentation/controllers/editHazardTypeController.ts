import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type HazardTypeModel from '@/features/setting/HazardType/Data/models/hazardTypeModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import EditHazardTypeUseCase from '@/features/setting/HazardType/Domain/useCase/editHazardTypeUseCase'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import type EditHazardTypeParams from '../../Core/params/editHazardTypeParams'
import { useRoute } from 'vue-router'

export default class EditHazardTypeController extends ControllerInterface<HazardTypeModel> {
  private static instance: EditHazardTypeController

  private constructor() {
    super()
  }

  private EditHazardTypeUseCase = new EditHazardTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditHazardTypeController()
    }
    return this.instance
  }

  async editHazardType(params: EditHazardTypeParams, router: any) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      params.validate()

      if (!params.validate().isValid) {
        params.validateOrThrow()
        return
      }
      const dataState: DataState<HazardTypeModel> = await this.EditHazardTypeUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.message,
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
        // console.log(this.state.value.data)
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.error?.title ?? 'Ann Error Occurred',
          imageElement: errorImage,
          messageContent: null,
        })
      }
    } catch (error: any) {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog',
        titleContent: this.state.value.message,
        imageElement: errorImage,
        messageContent: null,
      })
    }
    return this.state
  }
}
