import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { AddVisitCategoryRepo } from '../repositories/addVisitCategoryRepo'
import type VisitCategoryModel from '../../Data/models/VisitCategoryModel'

export default class AddVisitCategoryUseCase implements UseCase<VisitCategoryModel, Params> {
  async call(params: Params): Promise<DataState<VisitCategoryModel>> {
    return AddVisitCategoryRepo.getInstance().call(params)
  }
}
