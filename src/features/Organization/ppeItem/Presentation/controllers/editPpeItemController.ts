import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type PpeItemModel from '../../Data/models/PpeItemModel'
import EditPpeItemUseCase from '../../Domain/useCase/editPpeItemUseCase'
import type { Router } from 'vue-router'

export default class EditPpeItemController extends ControllerInterface<PpeItemModel> {
  private static instance: EditPpeItemController

  private constructor() {
    super()
  }

  private EditPpeItemUseCase = new EditPpeItemUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditPpeItemController()
    }
    return this.instance
  }

  async editPpeItem(params: Params, router: Router) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<PpeItemModel> =
        await this.EditPpeItemUseCase.call(params)
      this.setLoading()

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: this.state.value.message,
          imageElement: successImage,
          messageContent: null,
        })
        const root = router.currentRoute.value.path.startsWith('/admin') ? '/admin' : '/organization'
        await router.push(`${root}/ppe-items`)
        // console.log(this.state.value.data)
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog-error',
          titleContent: this.state.value.error?.title ?? 'Ann Error Occurred',
          imageElement: errorImage,
          messageContent: null,
        })
      }
    } catch {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog-error',
        titleContent: this.state.value.message,
        imageElement: errorImage,
        messageContent: null,
      })
    }
    return this.state
  }
}
