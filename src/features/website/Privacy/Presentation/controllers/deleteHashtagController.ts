import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type HashtagModel from '../../Data/models/PrivacyModel'
import DeleteHashtagUseCase from '../../Domain/useCase/deleteHashtagUseCase'

export default class DeleteHashtagController extends ControllerInterface<HashtagModel> {
  private static instance: DeleteHashtagController
  private constructor() {
    super()
  }
  private DeleteHashtagUseCase = new DeleteHashtagUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteHashtagController()
    }
    return this.instance
  }

  async deleteHashtag(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<HashtagModel> =
        await this.DeleteHashtagUseCase.call(params)

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
