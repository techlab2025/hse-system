import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ApproveSubscriptionApplicationRepo } from '../repositories/ApproveSubscriptionApplicatetionRepo'
import type SubscriptionModel from '@/features/setting/Subscription/Data/models/SubscriptionModel'

export default class ApproveSubscriptionApplicationUseCase
  implements UseCase<SubscriptionModel, Params>
{
  async call(params: Params): Promise<DataState<SubscriptionModel>> {
    return ApproveSubscriptionApplicationRepo.getInstance().call(params)
  }
}
