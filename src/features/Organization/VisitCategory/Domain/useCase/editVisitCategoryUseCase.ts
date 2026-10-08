import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { EditVisitCategoryRepo } from '../repositories/editVisitCategoryRepo'
import type VisitCategoryModel from '../../Data/models/VisitCategoryModel'

export default class EditVisitCategoryUseCase implements UseCase<VisitCategoryModel, Params> {
  async call(params: Params): Promise<DataState<VisitCategoryModel>> {
    return EditVisitCategoryRepo.getInstance().call(params)
  }
}
