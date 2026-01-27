import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { IndexSubscriptionTypeRepo } from '../repositories/indexSubscriptionTypeRepo'
import type SubscriptionTypeModel from '../../Data/models/SubscriptionTypeModel'

export default class IndexSubscriptionTypeUseCase implements UseCase<SubscriptionTypeModel[], Params> {
  async call(params: Params): Promise<DataState<SubscriptionTypeModel[]>> {
    return IndexSubscriptionTypeRepo.getInstance().call(params)
  }
}
