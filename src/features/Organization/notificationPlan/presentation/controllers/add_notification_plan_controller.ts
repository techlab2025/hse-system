import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'

import type Params from '@/base/core/params/params'
// import successImage from '@/assets/images/success-offer.png'

import errorImage from '@/assets/images/error.png'
import AddNotificationPlanUseCase from '../../Domain/use_case/add_notification_plan_use_case'
import type NotificationPlanModel from '../../Data/models/notification_plan_model'
import type { Router } from 'vue-router'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import successImage from '@/assets/images/Success.png'
export default class AddNotificationPlanController extends ControllerInterface<NotificationPlanModel> {
  private static instance: AddNotificationPlanController
  private constructor() {
    super()
  }
  private AddNotificationPlanUseCase = new AddNotificationPlanUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddNotificationPlanController()
    }
    return this.instance
  }

  async addNotificationPlan(params: Params, router: Router, draft: boolean = false) {
    try {
      const dataState: DataState<NotificationPlanModel> =
        await this.AddNotificationPlanUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })
        if (!draft)
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
    } catch (error: any) {
      console.log(error)
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog',
        titleContent: this.state.value.error?.title ?? 'An Error Occurred',
        imageElement: errorImage,
        messageContent: 'There is an error while adding the notification Plan',
      })
    }

    super.handleResponseDialogs()
    return this.state
  }
}
