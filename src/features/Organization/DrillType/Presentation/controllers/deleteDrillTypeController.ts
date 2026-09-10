import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type DrillTypeModel from '../../Data/models/DrillTypeModel'
import DeleteDrillTypeUseCase from '../../Domain/useCase/deleteDrillTypeUseCase'

export default class DeleteDrillTypeController extends ControllerInterface<DrillTypeModel> {
  private static instance: DeleteDrillTypeController
  private constructor() {
    super()
  }
  private DeleteDrillTypeUseCase = new DeleteDrillTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteDrillTypeController()
    }
    return this.instance
  }

  async deleteDrillType(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<DrillTypeModel> =
        await this.DeleteDrillTypeUseCase.call(params)
      this.setLoading()

      this.setState(dataState)
      if (this.isDataSuccess()) {
        // useLoaderStore().endLoadingWithDialog();
      } else {
        throw new Error('Error while addServices')
      }
    } catch (error: any) {
      console.log(error)
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog-error',
        titleContent: this.state.value.message,
        imageElement: errorImage,
        messageContent: null,
      })
    }
    super.handleResponseDialogs()
    return this.state
  }
}
