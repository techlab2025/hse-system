import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type IncidentCategoryDetailsModel from '../../Data/models/IncidentCategoryDetailsModel'
import { ShowIncidentCategoryRepo } from '../repositories/showIncidentCategoryRepo'

export default class ShowIncidentCategoryUseCase
  implements UseCase<IncidentCategoryDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<IncidentCategoryDetailsModel>> {
    return ShowIncidentCategoryRepo.getInstance().call(params)
  }
}
