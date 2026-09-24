import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ShowTraningTopicRepo } from '@/features/Organization/TraningTopic/Domain/repositories/showTraningTopicRepo'
import type TraningTopicDetailsModel from '@/features/Organization/TraningTopic/Data/models/TraningTopicDetailsModel'

export default class ShowTraningTopicUseCase
  implements UseCase<TraningTopicDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<TraningTopicDetailsModel>> {
    return ShowTraningTopicRepo.getInstance().call(params)
  }
}
