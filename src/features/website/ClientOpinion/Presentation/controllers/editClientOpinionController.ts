import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type ClientOpinionModel from '../../Data/models/ClientOpinionModel'
import EditClientOpinionUseCase from '../../Domain/useCase/editClientOpinionUseCase'

export default class EditClientOpinionController extends ControllerInterface<ClientOpinionModel> {
  private static instance: EditClientOpinionController

  private constructor() {
    super()
  }

  private EditClientOpinionUseCase = new EditClientOpinionUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditClientOpinionController()
    }
    return this.instance
  }

  async editClientOpinion(params: Params, router: any) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<ClientOpinionModel> = await this.EditClientOpinionUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.message,
          imageElement: successImage,
          messageContent: null,
        })
        await router.push('/admin/client-opinions')
        // console.log(this.state.value.data)
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.error?.title ?? 'Ann Error Occurred',
          imageElement: errorImage,
          messageContent: null,
        })
      }
    } catch (error: any) {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog',
        titleContent: this.state.value.message,
        imageElement: errorImage,
        messageContent: null,
      })
    }
    return this.state
  }
}
