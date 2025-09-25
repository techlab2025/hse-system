import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type CategoryteModel from '../../Data/models/CategoryModel'
import { AddCategoryRepo } from '../repositories/addCategoryRepo'


export default class AddCategoryteUseCase implements UseCase<CategoryteModel, Params> {
  async call(params: Params): Promise<DataState<CategoryteModel>> {
    return AddCategoryRepo.getInstance().call(params)
  }
}
