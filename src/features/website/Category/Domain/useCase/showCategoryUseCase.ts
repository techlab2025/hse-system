import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type CategoryDetailsModel from '../../Data/models/CategoryDetailsModel'
import { ShowCategoryRepo } from '../repositories/showCategoryRepo'


export default class ShowCategoryUseCase
  implements UseCase<CategoryDetailsModel, Params> {
  async call(params: Params): Promise<DataState<CategoryDetailsModel>> {
    return ShowCategoryRepo.getInstance().call(params)
  }
}
