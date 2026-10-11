import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { AddTraningTopicRepo } from '@/features/Organization/TraningTopic/Domain/repositories/addTraningTopicRepo'
import type TraningTopicModel from '@/features/Organization/TraningTopic/Data/models/TraningTopicModel'

export default class AddTraningTopicUseCase
  implements UseCase<TraningTopicModel, Params>
{
  async call(params: Params): Promise<DataState<TraningTopicModel>> {
    return AddTraningTopicRepo.getInstance().call(params)
  }
}
