import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DeleteVisitCategoryRepo } from '../repositories/deleteVisitCategoryRepo'
import type VisitCategoryModel from '../../Data/models/VisitCategoryModel'

export default class DeleteVisitCategoryUseCase implements UseCase<VisitCategoryModel, Params> {
  async call(params: Params): Promise<DataState<VisitCategoryModel>> {
    return DeleteVisitCategoryRepo.getInstance().call(params)
  }
}
