import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type FactoryItemModel from '@/features/setting/FactoryItem/Data/models/factoryItemModel.ts'
import { DeleteFactoryItemRepo } from '@/features/setting/FactoryItem/Domain/repositories/deleteFactoryItemRepo.ts'

export default class DeleteFactoryItemUseCase implements UseCase<FactoryItemModel, Params> {
  async call(params: Params): Promise<DataState<FactoryItemModel>> {
    return DeleteFactoryItemRepo.getInstance().call(params)
  }
}
