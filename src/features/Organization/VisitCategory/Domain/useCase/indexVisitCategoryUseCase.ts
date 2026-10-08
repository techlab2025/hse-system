import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { IndexVisitCategoryRepo } from '../repositories/indexVisitCategoryRepo'
import type VisitCategoryModel from '../../Data/models/VisitCategoryModel'

export default class IndexVisitCategoryUseCase implements UseCase<VisitCategoryModel[], Params> {
  async call(params: Params): Promise<DataState<VisitCategoryModel[]>> {
    return IndexVisitCategoryRepo.getInstance().call(params)
  }
}
