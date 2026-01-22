import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import EquipmentTypeModel from '@/features/setting/EquipmentType/Data/models/equipmentTypeModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DeleteEquipmentTypeUseCase from '@/features/setting/EquipmentType/Domain/useCase/deleteEquipmentTypeUseCase.ts'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'

export default class DeleteEquipmentTypeController extends ControllerInterface<EquipmentTypeModel> {
  private static instance: DeleteEquipmentTypeController
  private constructor() {
    super()
  }
  private DeleteEquipmentTypeUseCase = new DeleteEquipmentTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteEquipmentTypeController()
    }
    return this.instance
  }

  async deleteEquipmentType(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<EquipmentTypeModel> =
        await this.DeleteEquipmentTypeUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
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
