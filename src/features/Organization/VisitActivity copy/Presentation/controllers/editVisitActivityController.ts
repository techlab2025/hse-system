import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type VisitActivityModel from '../../Data/models/VisitActivityModel'
import EditVisitActivityUseCase from '../../Domain/useCase/editVisitActivityUseCase'

export default class EditVisitActivityController extends ControllerInterface<VisitActivityModel> {
  private static instance: EditVisitActivityController
  private readonly editVisitActivityUseCase = new EditVisitActivityUseCase()

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new EditVisitActivityController()
    return this.instance
  }

  async editVisitActivity(params: Params, router: Router) {
    try {
      const dataState: DataState<VisitActivityModel> =
        await this.editVisitActivityUseCase.call(params)
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
        await router.push(`${root}/visit-activities`)
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog-error',
          titleContent: this.state.value.error?.title ?? 'An Error Occurred',
          imageElement: errorImage,
          messageContent: null,
        })
      }
    } catch (error: unknown) {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog-error',
        titleContent: this.state.value.message ?? String(error),
        imageElement: errorImage,
        messageContent: null,
      })
    }
    return this.state
  }
}
