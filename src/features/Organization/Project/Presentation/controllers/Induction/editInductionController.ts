import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type InductionModel from '../../../Data/models/Induction/InductionModel'
import EditInductionUseCase from '../../../Domain/useCase/Induction/editInductionUseCase'
import EditInductionParams from '../../../Core/params/induction/editInductionParams'

export default class EditInductionController extends ControllerInterface<InductionModel> {
  private static instance: EditInductionController
  private readonly useCase = new EditInductionUseCase()

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new EditInductionController()
    return this.instance
  }

  async editInduction(params: EditInductionParams, router: Router) {
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
          titleContent: this.state.value.message,
          imageElement: successImage,
          messageContent: null,
        })

        const root = router.currentRoute.value.path.startsWith('/admin') ? '/admin' : '/organization'
        await router.push(`${root}/inductions`)
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
