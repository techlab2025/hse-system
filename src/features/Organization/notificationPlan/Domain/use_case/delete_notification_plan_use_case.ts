import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type NotificationPlanDetailsModel from '../../Data/models/notification_plan_model'
import { DeleteNotificationPlanRepo } from '../repositories/delete_notification_plan_repo'

export default class DeleteNotificationPlanUseCase
  implements UseCase<NotificationPlanDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<NotificationPlanDetailsModel>> {
    return DeleteNotificationPlanRepo.getInstance().call(params)
  }
}
