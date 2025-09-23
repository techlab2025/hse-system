import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import disActiveLangUseCase from '@/features/setting/languages/Domain/useCase/disActiveLangUseCase'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'

export default class disActiveLangController extends ControllerInterface<LangModel> {
  private static instance: disActiveLangController
  private constructor() {
    super()
  }
  private disActiveLangUseCase = new disActiveLangUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new disActiveLangController()
    }
    return this.instance
  }

  async disActiveLang(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<LangModel> = await this.disActiveLangUseCase.call(params)

    this.setState(dataState)
    if (this.isDataSuccess()) {
      DialogSelector.instance.successDialog.openDialog({
        dialogName: 'dialog',
        titleContent: 'Client status changed successfully.',
        imageElement: successImage,
        messageContent: null,
      })
      // useLoaderStore().endLoadingWithDialog();
    } else {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog',
        titleContent: this.state.value.error?.title!,
        imageElement: errorImage,
        messageContent: null,
      })
      throw new Error('Error while addServices')
    }
    super.handleResponseDialogs()
    return this.state
  }
}
