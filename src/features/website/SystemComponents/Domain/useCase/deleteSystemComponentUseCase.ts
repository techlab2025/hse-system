import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type SystemComponentModel from '../../Data/models/SystemComponentModel'
import { DeleteSystemComponentRepo } from '../repositories/deleteSystemComponentRepo'

export default class DeleteSystemComponentUseCase implements UseCase<SystemComponentModel, Params> {
  async call(params: Params): Promise<DataState<SystemComponentModel>> {
    return DeleteSystemComponentRepo.getInstance().call(params)
  }
}
