import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type NotificationPlanDetailsModel from '../../Data/models/notification_plan_model'
import EditNotificationPlanUseCase from '../../Domain/use_case/edit_notification_plan_use_case'
import type { Router } from 'vue-router'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'

export default class EditNotificationPlanController extends ControllerInterface<NotificationPlanDetailsModel> {
  private static instance: EditNotificationPlanController
  private constructor() {
    super()
  }
  private editNotificationPlanUseCase = new EditNotificationPlanUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditNotificationPlanController()
    }
    return this.instance
  }

  async editNotificationPlan(params: Params, router: Router) {
    try {
      const dataState: DataState<NotificationPlanDetailsModel> =
        await this.editNotificationPlanUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Updated was successful',
          imageElement: successImage,
          messageContent: null,
        })

        await router.push({
          path: '/organization/notification-plan',
          query: router.currentRoute.value.query,
        })
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.error?.title ?? 'An Error Occurred',
          imageElement: errorImage,
          messageContent: null,
        })
      }
    } catch {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog',
        titleContent: this.state.value.message,
        imageElement: errorImage,
        messageContent: null,
      })
    }

    super.handleResponseDialogs()
    return this.state
  }
}
