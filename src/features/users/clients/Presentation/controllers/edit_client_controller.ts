import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import ClientModel from '@/features/users/clients/Data/models/index_client_model'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import EditClientUseCase from '@/features/users/clients/Domain/useCase/edit_client_use_case'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'

export default class EditClientController extends ControllerInterface<ClientModel> {
  private static instance: EditClientController

  private constructor() {
    super()
  }

  private EditClientUseCase = new EditClientUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditClientController()
    }
    return this.instance
  }

  async editClient(params: Params, router: any, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<ClientModel> = await this.EditClientUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })
        if (!draft) await router.push('/users')
        // console.log(this.state.value.data)
        await router.push('/users/All') // useLoaderStore().endLoadingWithDialog();
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
