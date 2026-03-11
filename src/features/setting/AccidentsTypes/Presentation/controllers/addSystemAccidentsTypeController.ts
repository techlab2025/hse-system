import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type AccidentsTypeModel from '../../Data/models/AccidentsTypeModel'
import AddSystemAccidentsTypeUseCase from '../../Domain/useCase/addSystemAccidentsTypeUseCase'
import IndexAccidentsTypeParams from '../../Core/params/indexAccidentsTypeParams'
import IndexAccidentsTypeController from './indexAccidentsTypeController'

export default class AddSystemAccidentsTypeController extends ControllerInterface<AccidentsTypeModel> {
  private static instance: AddSystemAccidentsTypeController
  private constructor() {
    super()
  }
  private addSystemAccidentsTypeUseCase = new AddSystemAccidentsTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddSystemAccidentsTypeController()
    }
    return this.instance
  }

  async addSystemAccidentsType(params: any, router: Router, draft: boolean = false) {
    try {
      params.validate()
      if (!params.validate().isValid) {
        params.validateOrThrow()
        return
      }
      const dataState: DataState<AccidentsTypeModel> =
        await this.addSystemAccidentsTypeUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })
        await IndexAccidentsTypeController.getInstance().getData(
          new IndexAccidentsTypeParams('', 1, 10, 1),
        )
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
