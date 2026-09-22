import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import AddVisitCategoryUseCase from '../../Domain/useCase/addVisitCategoryUseCase'
import type VisitCategoryModel from '../../Data/models/VisitCategoryModel'
import AddVisitCategoryParams from '../../Core/params/addVisitCategoryParams'

export default class AddVisitCategoryController extends ControllerInterface<VisitCategoryModel> {
  private static instance: AddVisitCategoryController
  private readonly useCase = new AddVisitCategoryUseCase()
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) this.instance = new AddVisitCategoryController()
    return this.instance
  }
  async addVisitCategory(params: AddVisitCategoryParams, router: Router, draft = false) {
    try {
      if (!params.validate().isValid) {
        params.validateOrThrow()
        return
      }
      const dataState: DataState<VisitCategoryModel> = await this.useCase.call(params)
      this.setLoading()
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })
        if (!draft) {
          const root = router.currentRoute.value.path.startsWith('/admin')
            ? '/admin'
            : '/organization'
          await router.push(`${root}/visit-categories`)
        }
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
        titleContent: this.state.value.error?.title ?? String(error),
        imageElement: errorImage,
        messageContent: null,
      })
    }
    super.handleResponseDialogs()
    return this.state
  }
}
