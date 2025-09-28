import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type OurSystemStepModel from '../../Data/models/OurSystemStepModel'
import DeleteOurSystemStepUseCase from '../../Domain/useCase/deleteOurSystemStepUseCase'

export default class DeleteOurSystemStepController extends ControllerInterface<OurSystemStepModel> {
  private static instance: DeleteOurSystemStepController
  private constructor() {
    super()
  }
  private DeleteOurSystemStepUseCase = new DeleteOurSystemStepUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteOurSystemStepController()
    }
    return this.instance
  }

  async deleteOurSystemStep(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<OurSystemStepModel> =
        await this.DeleteOurSystemStepUseCase.call(params)

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
