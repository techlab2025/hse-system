import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ShowSubscriptionRepo } from '../repositories/showSubscriptionRepo'
import type SubscriptionDetailsModel from '../../Data/models/SubscriptionDetailsModel'

export default class ShowSubscriptionUseCase implements UseCase<SubscriptionDetailsModel, Params> {
  async call(params: Params): Promise<DataState<SubscriptionDetailsModel>> {
    return ShowSubscriptionRepo.getInstance().call(params)
  }
}
