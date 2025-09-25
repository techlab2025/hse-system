import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type SystemWorkModel from '../../Data/models/SystemWorkModel'
import { DeleteSystemWorkRepo } from '../repositories/deleteSystemWorkRepo'




export default class DeleteSystemWorkUseCase implements UseCase<SystemWorkModel, Params> {
  async call(params: Params): Promise<DataState<SystemWorkModel>> {
    return DeleteSystemWorkRepo.getInstance().call(params)
  }
}
