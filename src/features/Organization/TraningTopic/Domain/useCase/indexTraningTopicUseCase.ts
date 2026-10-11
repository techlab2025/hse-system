import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { IndexTraningTopicRepo } from '@/features/Organization/TraningTopic/Domain/repositories/indexTraningTopicRepo'
import type TraningTopicModel from '@/features/Organization/TraningTopic/Data/models/TraningTopicModel'

export default class IndexTraningTopicUseCase
  implements UseCase<TraningTopicModel[], Params>
{
  async call(params: Params): Promise<DataState<TraningTopicModel[]>> {
    return IndexTraningTopicRepo.getInstance().call(params)
  }
}
