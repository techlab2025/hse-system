import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type NotificationPlanModel from '../../Data/models/notification_plan_model'
import { AddNotificationPlanRepo } from '../repositories/add_notification_plan_repo'

export default class AddNotificationPlanUseCase implements UseCase<NotificationPlanModel, Params> {
  async call(params: Params): Promise<DataState<NotificationPlanModel>> {
    return AddNotificationPlanRepo.getInstance().call(params)
  }
}
