import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import EquipmentTypeModel from '@/features/setting/EquipmentType/Data/models/ProjectTypeModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import disActiveEquipmentTypeUseCase from '@/features/setting/EquipmentType/Domain/useCase/disEquipmentTypeUseCase'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'

export default class disActiveEquipmentTypeController extends ControllerInterface<EquipmentTypeModel> {
  private static instance: disActiveEquipmentTypeController
  private constructor() {
    super()
  }
  private disActiveEquipmentTypeUseCase = new disActiveEquipmentTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new disActiveEquipmentTypeController()
    }
    return this.instance
  }

  async disActiveEquipmentType(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<EquipmentTypeModel> =
      await this.disActiveEquipmentTypeUseCase.call(params)

    this.setState(dataState)
    if (this.isDataSuccess()) {
      DialogSelector.instance.successDialog.openDialog({
        dialogName: 'dialog',
        titleContent: this.state.value.message,
        imageElement: successImage,
        messageContent: null,
      })
      // useLoaderStore().endLoadingWithDialog();
    } else {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog',
        titleContent: this.state.value.error?.title! ?? 'Ann Error Occurred',
        imageElement: errorImage,
        messageContent: null,
      })
      throw new Error('Error while addServices')
    }
    super.handleResponseDialogs()
    return this.state
  }
}
