import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DeleteSubscriptionRepo } from '../repositories/deleteSubscriptionRepo'
import type SubscriptionModel from '../../Data/models/SubscriptionModel'

export default class DeleteSubscriptionUseCase implements UseCase<SubscriptionModel, Params> {
  async call(params: Params): Promise<DataState<SubscriptionModel>> {
    return DeleteSubscriptionRepo.getInstance().call(params)
  }
}
