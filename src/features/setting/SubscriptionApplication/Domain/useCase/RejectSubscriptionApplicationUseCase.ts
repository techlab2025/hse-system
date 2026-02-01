import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { RejectSubscriptionApplicationRepo } from '../repositories/RejectSubscriptionApplicatetionRepo'
import type SubscriptionModel from '@/features/setting/Subscription/Data/models/SubscriptionModel'

export default class RejectSubscriptionApplicationUseCase implements UseCase<SubscriptionModel, Params> {
  async call(params: Params): Promise<DataState<SubscriptionModel>> {
    return RejectSubscriptionApplicationRepo.getInstance().call(params)
  }
}
