import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type SystemBannerModel from '../../Data/models/SystemBannerModel'
import DeleteSystemBannerUseCase from '../../Domain/useCase/deleteSystemBannerUseCase'

export default class DeleteSystemBannerController extends ControllerInterface<SystemBannerModel> {
  private static instance: DeleteSystemBannerController
  private constructor() {
    super()
  }
  private deleteSystemBannerUseCase = new DeleteSystemBannerUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteSystemBannerController()
    }
    return this.instance
  }

  async deleteSystemBanner(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<SystemBannerModel> =
        await this.deleteSystemBannerUseCase.call(params)

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
