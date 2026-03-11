import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type ObserverationTypeModel from '@/features/setting/ObserverationType/Data/models/observerationTypeModel'
import AddSystemObserverationTypeUseCase from '../../Domain/useCase/addSystemObserverationTypeUseCase'

export default class AddSystemObserverationTypeController extends ControllerInterface<ObserverationTypeModel> {
  private static instance: AddSystemObserverationTypeController
  private constructor() {
    super()
  }
  private addSystemObserverationTypeUseCase = new AddSystemObserverationTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddSystemObserverationTypeController()
    }
    return this.instance
  }

  async addSystemObserverationType(params: Params, router: Router, draft: boolean = false) {
    try {
      const dataState: DataState<ObserverationTypeModel> =
        await this.addSystemObserverationTypeUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })
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
