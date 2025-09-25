import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type CategoryModel from '../../Data/models/CategoryModel'
import { DeleteCategoryRepo } from '../repositories/deleteCategoryRepo'

export default class DeleteCategoryUseCase implements UseCase<CategoryModel, Params> {
  async call(params: Params): Promise<DataState<CategoryModel>> {
    return DeleteCategoryRepo.getInstance().call(params)
  }
}
