import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type EditObjectiveProgressParams from '../../Core/params/editObjectiveProgressParams'
import type ObjectiveProgressModel from '../../Data/models/objectiveProgressModel'
import EditObjectiveProgressUseCase from '../../Domain/useCase/editObjectiveProgressUseCase'

export default class EditObjectiveProgressController extends ControllerInterface<ObjectiveProgressModel> {
  private static instance: EditObjectiveProgressController

  private constructor() {
    super()
  }

  private editObjectiveProgressUseCase = new EditObjectiveProgressUseCase()

  static getInstance() {
    if (!this.instance) this.instance = new EditObjectiveProgressController()
    return this.instance
  }

  async editObjectiveProgress(params: EditObjectiveProgressParams, router: Router) {
    try {
      const validation = params.validate()
      if (!validation.isValid) {
        params.validateOrThrow()
        return this.state
      }

      this.setLoading()
      const dataState: DataState<ObjectiveProgressModel> =
        await this.editObjectiveProgressUseCase.call(params)
      this.setState(dataState)

      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: this.state.value.message ?? 'Progress updated successfully',
          imageElement: successImage,
          messageContent: null,
        })
        await router.push({
          name: 'organization-objectives-details',
          params: { objectiveId: params.objectiveId },
        })
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog-error',
          titleContent: this.state.value.error?.title ?? 'An error occurred',
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
