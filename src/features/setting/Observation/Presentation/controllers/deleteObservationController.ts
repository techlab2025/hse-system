import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import ObservationModel from '@/features/setting/Observation/Data/models/observationModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DeleteObservationUseCase from '@/features/setting/Observation/Domain/useCase/deleteObservationUseCase.ts'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'

export default class DeleteObservationController extends ControllerInterface<ObservationModel> {
  private static instance: DeleteObservationController
  private constructor() {
    super()
  }
  private DeleteObservationUseCase = new DeleteObservationUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteObservationController()
    }
    return this.instance
  }

  async deleteObservation(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<ObservationModel> =
        await this.DeleteObservationUseCase.call(params)

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
