import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import HealthConditionsModel from '@/features/setting/HealthConditions/Data/models/healthConditionsModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DeleteHealthConditionsUseCase from '@/features/setting/HealthConditions/Domain/useCase/deleteHealthConditionsUseCase.ts'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'

export default class DeleteHealthConditionsController extends ControllerInterface<HealthConditionsModel> {
  private static instance: DeleteHealthConditionsController
  private constructor() {
    super()
  }
  private DeleteHealthConditionsUseCase = new DeleteHealthConditionsUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteHealthConditionsController()
    }
    return this.instance
  }

  async deleteHealthConditions(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<HealthConditionsModel> =
        await this.DeleteHealthConditionsUseCase.call(params)

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
