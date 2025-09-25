import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type HomeContactUsModel from '../../Data/models/HomeContactUsModel'
import DeleteHomeContactUsUseCase from '../../Domain/useCase/deleteHomeContactUsUseCase'


export default class DeleteHomeContactUsController extends ControllerInterface<HomeContactUsModel> {
  private static instance: DeleteHomeContactUsController
  private constructor() {
    super()
  }
  private DeleteHomeContactUsUseCase = new DeleteHomeContactUsUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteHomeContactUsController()
    }
    return this.instance
  }

  async deleteHomeContactUs(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<HomeContactUsModel> =
        await this.DeleteHomeContactUsUseCase.call(params)

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
