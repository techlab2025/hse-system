import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type ProjectZoneModel from '../../Data/models/ProjectZoneModel'
import DeleteProjectZoneUseCase from '../../Domain/useCase/deleteProjectZoneUseCase'




export default class DeleteProjectZoneController extends ControllerInterface<ProjectZoneModel> {
  private static instance: DeleteProjectZoneController
  private constructor() {
    super()
  }
  private DeleteProjectZoneUseCase = new DeleteProjectZoneUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteProjectZoneController()
    }
    return this.instance
  }

  async deleteProjectZone(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<ProjectZoneModel> =
        await this.DeleteProjectZoneUseCase.call(params)

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
