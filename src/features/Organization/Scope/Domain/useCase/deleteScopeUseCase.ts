import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DeleteScopeRepo } from '../repositories/deleteScopeRepo'
import type ScopeModel from '../../Data/models/ScopeModel'

export default class DeleteScopeUseCase implements UseCase<ScopeModel, Params> {
  async call(params: Params): Promise<DataState<ScopeModel>> {
    return DeleteScopeRepo.getInstance().call(params)
  }
}
