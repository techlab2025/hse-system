import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import EditObjectivesUseCase from '../../Domain/useCase/editObjectivesUseCase'
import type ObjectivesModel from '../../Data/models/objectivesModel'
import EditObjectivesParams from '../../Core/params/editObjectivesParams'
import type { Router } from 'vue-router'

export default class EditObjectivesController extends ControllerInterface<ObjectivesModel> {
  private static instance: EditObjectivesController

  private constructor() {
    super()
  }

  private editObjectivesUseCase = new EditObjectivesUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditObjectivesController()
    }
    return this.instance
  }

  async editObjectives(params: EditObjectivesParams, router: Router) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const validation = params.validate()
      if (!validation.isValid) {
        params.validateOrThrow()
        return this.state
      }

      const dataState: DataState<ObjectivesModel> = await this.editObjectivesUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: this.state.value.message,
          imageElement: successImage,
          messageContent: null,
        })

        await router.push(`/organization/objectives`)
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
