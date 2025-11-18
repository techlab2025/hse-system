import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import DeleteEquipmentUseCase from '../../Domain/useCase/deleteEquipmentUseCase'
import type EquipmentModel from '../../Data/models/equipmentModel'
import successImage from '@/assets/images/Success.png'
import { useUserStore } from '@/stores/user'
import router from '@/router'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'

export default class DeleteEquipmentController extends ControllerInterface<EquipmentModel> {
  private static instance: DeleteEquipmentController
  private constructor() {
    super()
  }
  private deleteEquipmentUseCase = new DeleteEquipmentUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteEquipmentController()
    }
    return this.instance
  }

  async deleteEquipment(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<EquipmentModel> = await this.deleteEquipmentUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'deleted was successful',
          imageElement: successImage,
          messageContent: null,
        })


        const { user } = useUserStore()

        await router.push(`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/equipments`)
        // useLoaderStore().endLoadingWithDialog();
      } else {
        throw new Error('Error while addServices')
      }
    } catch (error: any) {
      console.log(error)
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog',
        titleContent: this.state.value.message,
        imageElement: errorImage,
        messageContent: null,
      })
    }
    super.handleResponseDialogs()
    return this.state
  }
}
