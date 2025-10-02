import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type EquipmentTypeModel from '@/features/setting/EquipmentType/Data/models/equipmentTypeModel.ts'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import EditEquipmentTypeUseCase from '@/features/setting/EquipmentType/Domain/useCase/editEquipmentTypeUseCase'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'

export default class EditEquipmentTypeController extends ControllerInterface<EquipmentTypeModel> {
  private static instance: EditEquipmentTypeController

  private constructor() {
    super()
  }

  private EditEquipmentTypeUseCase = new EditEquipmentTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditEquipmentTypeController()
    }
    return this.instance
  }

  async editEquipmentType(params: Params, router: any) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<EquipmentTypeModel> = await this.EditEquipmentTypeUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.message,
          imageElement: successImage,
          messageContent: null,
        })
        const { user } = useUserStore()

        await router.push(`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/equipment-types`)
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
