import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'

import type NotificationPlanDetailsModel from '../../Data/models/notification_plan_model'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import ActiveNotificationPlanUseCase from '../../Domain/use_case/active_notification_plan_use_case'

export default class ActiveNotificationPlanController extends ControllerInterface<NotificationPlanDetailsModel> {
  private static instance: ActiveNotificationPlanController
  private constructor() {
    super()
  }
  private activeNotificationPlanUseCase = new ActiveNotificationPlanUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ActiveNotificationPlanController()
    }
    return this.instance
  }

  async ActiveNotificationPlan(params: Params) {
    this.setLoading()
    try {
      const dataState: DataState<NotificationPlanDetailsModel> =
        await this.activeNotificationPlanUseCase.call(params)
      this.setState(dataState)
    } catch {
      return this.state
    }

    super.handleResponseDialogs()
    return this.state
  }
}
