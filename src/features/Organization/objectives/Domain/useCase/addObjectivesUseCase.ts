import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ObjectivesModel from '../../Data/models/objectivesModel'
import { AddObjectivesRepo } from '../repositories/addObjectivesRepo'


export default class AddObjectivesUseCase implements UseCase<ObjectivesModel, Params> {
  async call(params: Params): Promise<DataState<ObjectivesModel>> {
    return AddObjectivesRepo.getInstance().call(params)
  }
}
