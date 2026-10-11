import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ShowVisitCategoryRepo } from '../repositories/showVisitCategoryRepo'
import type VisitCategoryDetailsModel from '../../Data/models/VisitCategoryDetailsModel'

export default class ShowVisitCategoryUseCase implements UseCase<VisitCategoryDetailsModel, Params> {
  async call(params: Params): Promise<DataState<VisitCategoryDetailsModel>> {
    return ShowVisitCategoryRepo.getInstance().call(params)
  }
}
