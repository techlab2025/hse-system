import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type MethodsModel from '../../Data/models/MethodModel'
import { DeleteMethodsRepo } from '../repositories/deleteMethodsRepo'

export default class DeleteMethodsUseCase implements UseCase<MethodsModel, Params> {
  async call(params: Params): Promise<DataState<MethodsModel>> {
    return DeleteMethodsRepo.getInstance().call(params)
  }
}
