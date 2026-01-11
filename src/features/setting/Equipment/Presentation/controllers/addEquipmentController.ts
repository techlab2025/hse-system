import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type EquipmentModel from '@/features/setting/Equipment/Data/models/equipmentModel'
import AddEquipmentUseCase from '../../Domain/useCase/addEquipmentUseCase'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import type AddEquipmentParams from '../../Core/params/addEquipmentParams'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'

export default class AddEquipmentController extends ControllerInterface<EquipmentModel> {
  private static instance: AddEquipmentController
  private constructor() {
    super()
  }
  private addEquipmentUseCase = new AddEquipmentUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddEquipmentController()
    }
    return this.instance
  }

  async addEquipment(params: AddEquipmentParams, router: Router, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    console.log(params, 'params')
    try {
      params.validate()
      if (!params.validate().isValid) {
        params.validateOrThrow()
        return
      }

      if(params?.equipmentRentTime < 1){
        new OpenWarningDilaog('Rent Time Should Be More Than One').openDialog()
        return
      }
      const dataState: DataState<EquipmentModel> = await this.addEquipmentUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })

        const { user } = useUserStore()

        if (!draft)
          await router.push(
            `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/equipments`,
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
