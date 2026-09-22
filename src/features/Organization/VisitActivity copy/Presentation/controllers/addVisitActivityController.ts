import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import AddVisitActivityUseCase from '../../Domain/useCase/addVisitActivityUseCase'
import type VisitActivityModel from '../../Data/models/VisitActivityModel'
import AddVisitActivityParams from '../../Core/params/addVisitActivityParams'

export default class AddVisitActivityController extends ControllerInterface<VisitActivityModel> {
  private static instance: AddVisitActivityController
  private readonly addVisitActivityUseCase = new AddVisitActivityUseCase()

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new AddVisitActivityController()
    return this.instance
  }

  async addVisitActivity(params: AddVisitActivityParams, router: Router, draft = false) {
    try {
      const validation = params.validate()
      if (!validation.isValid) {
        params.validateOrThrow()
        return
      }

      const dataState: DataState<VisitActivityModel> =
        await this.addVisitActivityUseCase.call(params)
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
          const root = router.currentRoute.value.path.startsWith('/admin') ? '/admin' : '/organization'
          await router.push(`${root}/visit-activities`)
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
