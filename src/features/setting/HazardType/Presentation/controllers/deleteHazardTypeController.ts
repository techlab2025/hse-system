import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import HazardTypeModel from '@/features/setting/HazardType/Data/models/hazardTypeModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DeleteHazardTypeUseCase from '@/features/setting/HazardType/Domain/useCase/deleteHazardTypeUseCase.ts'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'

export default class DeleteHazardTypeController extends ControllerInterface<HazardTypeModel> {
  private static instance: DeleteHazardTypeController
  private constructor() {
    super()
  }
  private DeleteHazardTypeUseCase = new DeleteHazardTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteHazardTypeController()
    }
    return this.instance
  }

  async deleteHazardType(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<HazardTypeModel> =
        await this.DeleteHazardTypeUseCase.call(params)

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
