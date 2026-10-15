import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ObjectiveProgressDetailsParams from '../../Core/params/objectiveProgressDetailsParams'
import type ObjectiveProgressModel from '../../Data/models/objectiveProgressModel'
import { ObjectiveProgressDetailsRepo } from '../repositories/objectiveProgressDetailsRepo'
export default class ObjectiveProgressDetailsUseCase
  implements UseCase<ObjectiveProgressModel, ObjectiveProgressDetailsParams>
{
  async call(params: ObjectiveProgressDetailsParams): Promise<DataState<ObjectiveProgressModel>> {
    return ObjectiveProgressDetailsRepo.getInstance().call(params)
  }
}
