import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type NotificationPlanDetailsModel from '../../Data/models/notification_plan_model'
import DeleteNotificationPlanUseCase from '../../Domain/use_case/delete_notification_plan_use_case'

export default class DeleteNotificationPlanController extends ControllerInterface<NotificationPlanDetailsModel> {
  private static instance: DeleteNotificationPlanController
  private deleteNotificationPlanUseCase = new DeleteNotificationPlanUseCase()

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteNotificationPlanController()
    }
    return this.instance
  }

  async DeleteNotificationPlan(params: Params) {
    this.setLoading()

    try {
      const dataState: DataState<NotificationPlanDetailsModel> =
        await this.deleteNotificationPlanUseCase.call(params)
      this.setState(dataState)
    } catch {
      return this.state
    }

    super.handleResponseDialogs()
    return this.state
  }
}
