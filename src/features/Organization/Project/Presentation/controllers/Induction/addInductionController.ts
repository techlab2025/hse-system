import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type InductionModel from '../../../Data/models/Induction/InductionModel'
import AddInductionUseCase from '../../../Domain/useCase/Induction/addInductionUseCase'
import AddInductionParams from '../../../Core/params/induction/addInductionParams'

export default class AddInductionController extends ControllerInterface<InductionModel> {
  private static instance: AddInductionController
  private readonly useCase = new AddInductionUseCase()

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new AddInductionController()
    return this.instance
  }

  async addInduction(params: AddInductionParams, router: Router, draft: boolean = false) {
    try {
      params.validate()
      if (!params.validate().isValid) {
        params.validateOrThrow()
        return this.state
      }

      this.setLoading()
      const dataState: DataState<InductionModel> = await this.useCase.call(params)
      this.setState(dataState)

      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })

        const root = router.currentRoute.value.path.startsWith('/admin') ? '/admin' : '/organization'
        const routeProjectId = router.currentRoute.value.query.project_id
        const projectId = Array.isArray(routeProjectId) ? routeProjectId[0] : routeProjectId
        const inductionRoute = projectId
          ? { path: `${root}/inductions`, query: { project_id: projectId } }
          : `${root}/inductions`
        if (!draft) await router.push(inductionRoute)
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog-error',
          titleContent: this.state.value.error?.title ?? 'Ann Error Occurred',
          imageElement: errorImage,
          messageContent: null,
        })
      }
    } catch (error: unknown) {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog-error',
        titleContent: this.state.value.error?.title ?? (error as string),
        imageElement: errorImage,
        messageContent: null,
      })
    }

    super.handleResponseDialogs()
    return this.state
  }
}
