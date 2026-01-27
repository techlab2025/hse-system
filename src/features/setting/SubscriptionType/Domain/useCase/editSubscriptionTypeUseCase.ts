import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { EditSubscriptionTypeRepo } from '../repositories/editSubscriptionTypeRepo'
import type SubscriptionTypeModel from '../../Data/models/SubscriptionTypeModel'

export default class EditSubscriptionTypeUseCase implements UseCase<SubscriptionTypeModel, Params> {
  async call(params: Params): Promise<DataState<SubscriptionTypeModel>> {
    return EditSubscriptionTypeRepo.getInstance().call(params)
  }
}
