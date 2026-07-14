import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'

import type NotificationPlanDetailsModel from '../../Data/models/notification_plan_model'
import ShowNotificationPlanUseCase from '../../Domain/use_case/show_notification_plan_use_case'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'

export default class ShowNotificationPlanController extends ControllerInterface<NotificationPlanDetailsModel> {
  private static instance: ShowNotificationPlanController
  private constructor() {
    super()
  }
  private showNotificationPlanUseCase = new ShowNotificationPlanUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowNotificationPlanController()
    }
    return this.instance
  }

  async ShowNotificationPlan(params: Params) {
    this.setLoading()
    try {
      const dataState: DataState<NotificationPlanDetailsModel> =
        await this.showNotificationPlanUseCase.call(params)
      this.setState(dataState)
    } catch {
      return this.state
    }

    super.handleResponseDialogs()
    return this.state
  }
}
