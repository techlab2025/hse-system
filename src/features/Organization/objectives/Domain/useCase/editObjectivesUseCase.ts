import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ObjectivesModel from '../../Data/models/objectivesModel'
import { EditObjectivesRepo } from '../repositories/editObjectivesRepo'


export default class EditObjectivesUseCase implements UseCase<ObjectivesModel, Params> {
  async call(params: Params): Promise<DataState<ObjectivesModel>> {
    return EditObjectivesRepo.getInstance().call(params)
  }
}
