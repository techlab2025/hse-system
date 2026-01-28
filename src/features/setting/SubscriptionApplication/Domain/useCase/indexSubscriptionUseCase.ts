import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { IndexSubscriptionRepo } from '../repositories/indexSubscriptionApplicationRepo'
import type SubscriptionModel from '../../Data/models/SubscriptionModel'

export default class IndexSubscriptionUseCase implements UseCase<SubscriptionModel[], Params> {
  async call(params: Params): Promise<DataState<SubscriptionModel[]>> {
    return IndexSubscriptionRepo.getInstance().call(params)
  }
}
