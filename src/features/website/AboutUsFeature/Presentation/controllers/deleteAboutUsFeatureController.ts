import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type AboutUsFeatureModel from '../../Data/models/AboutUsFeatureModel'
import DeleteAboutUsFeatureUseCase from '../../Domain/useCase/deleteAboutUsFeatureUseCase'




export default class DeleteAboutUsFeatureController extends ControllerInterface<AboutUsFeatureModel> {
  private static instance: DeleteAboutUsFeatureController
  private constructor() {
    super()
  }
  private DeleteAboutUsFeatureUseCase = new DeleteAboutUsFeatureUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteAboutUsFeatureController()
    }
    return this.instance
  }

  async deleteAboutUsFeature(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<AboutUsFeatureModel> =
        await this.DeleteAboutUsFeatureUseCase.call(params)

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
