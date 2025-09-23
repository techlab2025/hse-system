import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type FactoryModel from '../../Data/models/FactoryModel'
import { DeleteFactoryRepo } from '../repositories/deleteFactoryRepo'

export default class DeleteFactoryUseCase implements UseCase<FactoryModel, Params> {
  async call(params: Params): Promise<DataState<FactoryModel>> {
    return DeleteFactoryRepo.getInstance().call(params)
  }
}
