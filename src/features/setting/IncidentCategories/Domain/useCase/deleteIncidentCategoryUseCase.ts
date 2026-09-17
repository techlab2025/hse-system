import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type IncidentCategoryModel from '../../Data/models/IncidentCategoryModel'
import { DeleteIncidentCategoryRepo } from '../repositories/deleteIncidentCategoryRepo'

export default class DeleteIncidentCategoryUseCase implements UseCase<IncidentCategoryModel, Params> {
  async call(params: Params): Promise<DataState<IncidentCategoryModel>> {
    return DeleteIncidentCategoryRepo.getInstance().call(params)
  }
}
