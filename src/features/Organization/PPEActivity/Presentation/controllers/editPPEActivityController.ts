import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type PPEActivityModel from '../../Data/models/PPEActivityModel'
import EditPPEActivityUseCase from '../../Domain/useCase/editPPEActivityUseCase'
import type { Router } from 'vue-router'

export default class EditPPEActivityController extends ControllerInterface<PPEActivityModel> {
  private static instance: EditPPEActivityController

  private constructor() {
    super()
  }

  private EditPPEActivityUseCase = new EditPPEActivityUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditPPEActivityController()
    }
    return this.instance
  }

  async editPPEActivity(params: Params, router: Router) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<PPEActivityModel> =
        await this.EditPPEActivityUseCase.call(params)
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
        await router.push(`${root}/ppe-activities`)
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
