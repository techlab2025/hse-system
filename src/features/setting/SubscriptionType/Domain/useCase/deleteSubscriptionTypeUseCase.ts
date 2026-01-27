import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DeleteSubscriptionTypeRepo } from '../repositories/deleteSubscriptionTypeRepo'
import type SubscriptionTypeModel from '../../Data/models/SubscriptionTypeModel'

export default class DeleteSubscriptionTypeUseCase implements UseCase<SubscriptionTypeModel, Params> {
  async call(params: Params): Promise<DataState<SubscriptionTypeModel>> {
    return DeleteSubscriptionTypeRepo.getInstance().call(params)
  }
}
