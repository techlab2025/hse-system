import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import IndexNotificationPlanUseCase from '../../Domain/use_case/index_notification_plan_use_case'
import type NotificationPlanModel from '../../Data/models/notification_plan_model'

export default class IndexNotificationPlanController extends ControllerInterface<
  NotificationPlanModel[]
> {
  private static instance: IndexNotificationPlanController
  private constructor() {
    super()
  }
  private indexNotificationPlanUseCase = new IndexNotificationPlanUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexNotificationPlanController()
    }
    return this.instance
  }

  async getData(params: Params) {
    this.setLoading()

    const dataState: DataState<NotificationPlanModel[]> =
      await this.indexNotificationPlanUseCase.call(params)

    this.setState(dataState)
    super.handleResponseDialogs()
    return this.state
  }
}
