import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { AddSubscriptionTypeRepo } from '../repositories/addSubscriptionTypeRepo'
import type SubscriptionTypeModel from '../../Data/models/SubscriptionTypeModel'

export default class AddSubscriptionTypeUseCase implements UseCase<SubscriptionTypeModel, Params> {
  async call(params: Params): Promise<DataState<SubscriptionTypeModel>> {
    return AddSubscriptionTypeRepo.getInstance().call(params)
  }
}
