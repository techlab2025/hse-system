import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { IndexSubscriptionApplicationRepo } from '../repositories/indexSubscriptionApplicationRepo'
import type SubscriptionApplicationModel from '../../Data/models/SubscriptionApplicationModel'

export default class IndexSubscriptionApplicationUseCase
  implements UseCase<SubscriptionApplicationModel[], Params>
{
  async call(params: Params): Promise<DataState<SubscriptionApplicationModel[]>> {
    return IndexSubscriptionApplicationRepo.getInstance().call(params)
  }
}
