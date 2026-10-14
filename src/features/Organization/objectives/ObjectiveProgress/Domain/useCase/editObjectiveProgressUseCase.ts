import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type EditObjectiveProgressParams from '../../Core/params/editObjectiveProgressParams'
import type ObjectiveProgressModel from '../../Data/models/objectiveProgressModel'
import { EditObjectiveProgressRepo } from '../repositories/editObjectiveProgressRepo'
export default class EditObjectiveProgressUseCase
  implements UseCase<ObjectiveProgressModel, EditObjectiveProgressParams>
{
  async call(params: EditObjectiveProgressParams): Promise<DataState<ObjectiveProgressModel>> {
    return EditObjectiveProgressRepo.getInstance().call(params)
  }
}
