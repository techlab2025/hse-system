import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type IndexObjectiveProgressParams from '../../Core/params/indexObjectiveProgressParams'
import type ObjectiveProgressHistoryModel from '../../Data/models/objectiveProgressHistoryModel'
import { IndexObjectiveProgressRepo } from '../repositories/indexObjectiveProgressRepo'
export default class IndexObjectiveProgressUseCase
  implements UseCase<ObjectiveProgressHistoryModel, IndexObjectiveProgressParams>
{
  async call(
    params: IndexObjectiveProgressParams,
  ): Promise<DataState<ObjectiveProgressHistoryModel>> {
    return IndexObjectiveProgressRepo.getInstance().call(params)
  }
}
