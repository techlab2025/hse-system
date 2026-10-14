import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type AddObjectiveProgressParams from '../../Core/params/addObjectiveProgressParams'
import type ObjectiveProgressModel from '../../Data/models/objectiveProgressModel'
import AddObjectiveProgressUseCase from '../../Domain/useCase/addObjectiveProgressUseCase'

export default class AddObjectiveProgressController extends ControllerInterface<ObjectiveProgressModel> {
  private static instance: AddObjectiveProgressController

  private constructor() {
    super()
  }

  private addObjectiveProgressUseCase = new AddObjectiveProgressUseCase()

  static getInstance() {
    if (!this.instance) this.instance = new AddObjectiveProgressController()
    return this.instance
  }

  async addObjectiveProgress(params: AddObjectiveProgressParams, router: Router) {
    try {
      const validation = params.validate()
      if (!validation.isValid) {
        params.validateOrThrow()
        return this.state
      }

      this.setLoading()
      const dataState: DataState<ObjectiveProgressModel> =
        await this.addObjectiveProgressUseCase.call(params)
      this.setState(dataState)

      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: this.state.value.message ?? 'Progress added successfully',
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
