import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import AddEquipmentTypeUseCase from '@/features/setting/EquipmentType/Domain/useCase/addEquipmentTypeUseCase'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type EquipmentTypeModel from '@/features/setting/EquipmentType/Data/models/equipmentTypeModel'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { useUserStore } from '@/stores/user'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'
import AddSystemEquipmentTypeUseCase from '../../Domain/useCase/addSystemEquipmentTypeUseCase'
import IndexSystemEquipmentTypeController from './indexSystemEquipmentTypeController'
import IndexObserverationTypeParams from '@/features/setting/ObserverationType/Core/params/indexObserverationTypeParams'

export default class AddSystemEquipmentTypeController extends ControllerInterface<EquipmentTypeModel> {
  private static instance: AddSystemEquipmentTypeController
  private constructor() {
    super()
  }
  private AddSystemEquipmentTypeUseCase = new AddSystemEquipmentTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddSystemEquipmentTypeController()
    }
    return this.instance
  }

  async addSystemEquipmentType(params: any, router: Router, draft: boolean = false) {
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
      const dataState: DataState<EquipmentTypeModel> =
        await this.AddSystemEquipmentTypeUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })

        const { user } = useUserStore()

        await IndexSystemEquipmentTypeController.getInstance().getData(
          new IndexObserverationTypeParams('', 1, 10, 1, undefined, true),
        )

        if (!draft)
          if (
            router.currentRoute?.value.fullPath.includes('equipment-type') &&
            !router.currentRoute?.value.fullPath.includes('project-progress')
          ) {
            await router.push(
              `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/equipment-types`,
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
