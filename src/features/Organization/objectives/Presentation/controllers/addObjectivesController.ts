import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import AddObjectivesUseCase from '../../Domain/useCase/addObjectivesUseCase'
import type ObjectivesModel from '../../Data/models/objectivesModel'
import AddObjectivesParams from '../../Core/params/addObjectivesParams'

export default class AddObjectivesController extends ControllerInterface<ObjectivesModel> {
  private static instance: AddObjectivesController
  private constructor() {
    super()
  }
  private addObjectivesUseCase = new AddObjectivesUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddObjectivesController()
    }
    return this.instance
  }

  async addObjectives(
    params: AddObjectivesParams,
    router: Router,
    draft: boolean = false,
    redirectPath: string = '/organization/objectives',
  ) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const validation = params.validate()
      if (!validation.isValid) {
        params.validateOrThrow()
        return this.state
      }

      const dataState: DataState<ObjectivesModel> = await this.addObjectivesUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })

        if (!draft) await router.push(redirectPath)

        // useLoaderStore().endLoadingWithDialog();
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
