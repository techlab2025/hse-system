import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import ObserverationTypeModel from '@/features/setting/ObserverationType/Data/models/observerationTypeModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DeleteObserverationTypeUseCase from '@/features/setting/ObserverationType/Domain/useCase/deleteObserverationTypeUseCase.ts'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'

export default class DeleteObserverationTypeController extends ControllerInterface<ObserverationTypeModel> {
  private static instance: DeleteObserverationTypeController
  private constructor() {
    super()
  }
  private DeleteObserverationTypeUseCase = new DeleteObserverationTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteObserverationTypeController()
    }
    return this.instance
  }

  async deleteObserverationType(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<ObserverationTypeModel> =
        await this.DeleteObserverationTypeUseCase.call(params)

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
