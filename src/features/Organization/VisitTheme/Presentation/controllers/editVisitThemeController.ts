import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type VisitThemeModel from '../../Data/models/VisitThemeModel'
import EditVisitThemeUseCase from '../../Domain/useCase/editVisitThemeUseCase'

export default class EditVisitThemeController extends ControllerInterface<VisitThemeModel> {
  private static instance: EditVisitThemeController
  private readonly useCase = new EditVisitThemeUseCase()
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) this.instance = new EditVisitThemeController()
    return this.instance
  }
  async editVisitTheme(params: Params, router: Router) {
    try {
      const dataState: DataState<VisitThemeModel> = await this.useCase.call(params)
      this.setLoading()
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: this.state.value.message,
          imageElement: successImage,
          messageContent: null,
        })
        const root = router.currentRoute.value.path.startsWith('/admin')
          ? '/admin'
          : '/organization'
        await router.push(`${root}/visit-themes`)
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
