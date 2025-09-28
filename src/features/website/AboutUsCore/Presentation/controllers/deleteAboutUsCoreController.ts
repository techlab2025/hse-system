import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type AboutUsCoreModel from '../../Data/models/AboutUsCoreModel'
import DeleteAboutUsCoreUseCase from '../../Domain/useCase/deleteAboutUsCoreUseCase'



export default class DeleteAboutUsCoreController extends ControllerInterface<AboutUsCoreModel> {
  private static instance: DeleteAboutUsCoreController
  private constructor() {
    super()
  }
  private DeleteAboutUsCoreUseCase = new DeleteAboutUsCoreUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteAboutUsCoreController()
    }
    return this.instance
  }

  async deleteAboutUsCore(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<AboutUsCoreModel> =
        await this.DeleteAboutUsCoreUseCase.call(params)

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
