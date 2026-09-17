import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type IncidentCategoryModel from '../../Data/models/IncidentCategoryModel'
import AddSystemIncidentCategoryUseCase from '../../Domain/useCase/addSystemIncidentCategoryUseCase'
import IndexIncidentCategoryParams from '../../Core/params/indexIncidentCategoryParams'
import IndexIncidentCategoryController from './indexIncidentCategoryController'

export default class AddSystemIncidentCategoryController extends ControllerInterface<IncidentCategoryModel> {
  private static instance: AddSystemIncidentCategoryController
  private constructor() {
    super()
  }
  private addSystemIncidentCategoryUseCase = new AddSystemIncidentCategoryUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddSystemIncidentCategoryController()
    }
    return this.instance
  }

  async addSystemIncidentCategory(params: any, router: Router, draft: boolean = false) {
    try {
      params.validate()
      if (!params.validate().isValid) {
        params.validateOrThrow()
        return
      }
      const dataState: DataState<IncidentCategoryModel> =
        await this.addSystemIncidentCategoryUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })
        await IndexIncidentCategoryController.getInstance().getData(
          new IndexIncidentCategoryParams('', 1, 10, 1),
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
