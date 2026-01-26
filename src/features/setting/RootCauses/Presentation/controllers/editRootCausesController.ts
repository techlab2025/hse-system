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
import type EditRootCausesParams from '../../Core/params/editRootCausesParams'
import type RootCausesModel from '../../Data/models/RootCausesModel'
import EditRootCausesUseCase from '../../Domain/useCase/editRootCausesUseCase'

export default class EditRootCausesController extends ControllerInterface<RootCausesModel> {
  private static instance: EditRootCausesController

  private constructor() {
    super()
  }

  private EditRootCausesUseCase = new EditRootCausesUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditRootCausesController()
    }
    return this.instance
  }

  async editRootCauses(params: EditRootCausesParams, router: any) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      params.validate()

      if (!params.validate().isValid) {
        params.validateOrThrow()
        return
      }
      const dataState: DataState<RootCausesModel> = await this.EditRootCausesUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.message,
          imageElement: successImage,
          messageContent: null,
        })
        const { user } = useUserStore()

        await router.push(
          `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/root-causes`,
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
