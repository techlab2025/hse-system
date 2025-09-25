import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type CategoryModel from '../../Data/models/CategoryModel'
import { EditCategoryRepo } from '../repositories/editCategoryRepo'


export default class EditCategoryUseCase implements UseCase<CategoryModel, Params> {
  async call(params: Params): Promise<DataState<CategoryModel>> {
    return EditCategoryRepo.getInstance().call(params)
  }
}
