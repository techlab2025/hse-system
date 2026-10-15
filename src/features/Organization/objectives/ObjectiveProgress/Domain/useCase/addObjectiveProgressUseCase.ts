import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type AddObjectiveProgressParams from '../../Core/params/addObjectiveProgressParams'
import type ObjectiveProgressModel from '../../Data/models/objectiveProgressModel'
import { AddObjectiveProgressRepo } from '../repositories/addObjectiveProgressRepo'
export default class AddObjectiveProgressUseCase
  implements UseCase<ObjectiveProgressModel, AddObjectiveProgressParams>
{
  async call(params: AddObjectiveProgressParams): Promise<DataState<ObjectiveProgressModel>> {
    return AddObjectiveProgressRepo.getInstance().call(params)
  }
}
