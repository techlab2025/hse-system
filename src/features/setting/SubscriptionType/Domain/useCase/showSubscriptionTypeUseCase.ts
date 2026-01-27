import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ShowSubscriptionTypeRepo } from '../repositories/showSubscriptionTypeRepo'
import type SubscriptionTypeDetailsModel from '../../Data/models/SubscriptionTypeDetailsModel'

export default class ShowSubscriptionTypeUseCase implements UseCase<SubscriptionTypeDetailsModel, Params> {
  async call(params: Params): Promise<DataState<SubscriptionTypeDetailsModel>> {
    return ShowSubscriptionTypeRepo.getInstance().call(params)
  }
}
