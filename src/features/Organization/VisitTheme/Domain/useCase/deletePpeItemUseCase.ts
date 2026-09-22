import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DeletePpeItemRepo } from '../repositories/deletePpeItemRepo'
import type PpeItemModel from '../../Data/models/PpeItemModel'

export default class DeletePpeItemUseCase implements UseCase<PpeItemModel, Params> {
  async call(params: Params): Promise<DataState<PpeItemModel>> {
    return DeletePpeItemRepo.getInstance().call(params)
  }
}
