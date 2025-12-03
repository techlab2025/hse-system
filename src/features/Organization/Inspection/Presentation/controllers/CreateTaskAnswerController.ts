import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import { useUserStore } from '@/stores/user'

import CreateTaskResultUseCase from '../../Domain/useCase/CreateTaskResultUseCase'
import type CreateTaskAmswerModel from '../../Data/models/CreateTaskResultModel'
import IndexInspectionController from './indexInspectionController'
import IndexInspectionParams from '../../Core/params/indexInspectionParams'

export default class CreateTaskAnswerController extends ControllerInterface<CreateTaskAmswerModel> {
  private static instance: CreateTaskAnswerController
  private constructor() {
    super()
  }
  private createTaskResultUseCase = new CreateTaskResultUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new CreateTaskAnswerController()
    }
    return this.instance
  }

  async CreateTaskAnswer(params: Params, router: Router, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const dataState: DataState<CreateTaskAmswerModel> =
        await this.createTaskResultUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })

        const { user } = useUserStore()

        await IndexInspectionController.getInstance().getData(
          new IndexInspectionParams('', 1, 10, 1),
        )

        // if (!draft) await router.push(`/organization/inspection`)

        // useLoaderStore().endLoadingWithDialog();
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.error?.title ?? 'Ann Error Occurred',
          imageElement: errorImage,
          messageContent: null,
        })
      }
    } catch (error: unknown) {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog',
        titleContent: this.state.value.error?.title ?? (error as string),
        imageElement: errorImage,
        messageContent: null,
      })
    }

    super.handleResponseDialogs()
    return this.state
  }
}
