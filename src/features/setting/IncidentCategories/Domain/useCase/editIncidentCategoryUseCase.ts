import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type IncidentCategoryModel from '../../Data/models/IncidentCategoryModel'
import { EditIncidentCategoryRepo } from '../repositories/editIncidentCategoryRepo'

export default class EditIncidentCategoryUseCase implements UseCase<IncidentCategoryModel, Params> {
  async call(params: Params): Promise<DataState<IncidentCategoryModel>> {
    return EditIncidentCategoryRepo.getInstance().call(params)
  }
}
