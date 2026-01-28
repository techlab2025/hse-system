import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { AddSubscriptionRepo } from '../repositories/addSubscriptionRepo'
import type SubscriptionModel from '../../Data/models/SubscriptionModel'

export default class AddSubscriptionUseCase implements UseCase<SubscriptionModel, Params> {
  async call(params: Params): Promise<DataState<SubscriptionModel>> {
    return AddSubscriptionRepo.getInstance().call(params)
  }
}
