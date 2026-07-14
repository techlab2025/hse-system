import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type NotificationPlanDetailsModel from '../../Data/models/notification_plan_model'
import { EditNotificationPlanRepo } from '../repositories/edit_notification_plan_repo'

export default class EditNotificationPlanUseCase
  implements UseCase<NotificationPlanDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<NotificationPlanDetailsModel>> {
    return EditNotificationPlanRepo.getInstance().call(params)
  }
}
