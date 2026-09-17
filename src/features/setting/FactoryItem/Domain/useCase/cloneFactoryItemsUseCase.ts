import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type FactoryItemModel from '../../Data/models/factoryItemModel'
import { CloneFactoryItemsRepo } from '../repositories/cloneFactoryItemsRepo'

export default class CloneFactoryItemsUseCase implements UseCase<FactoryItemModel, Params> {
  async call(params: Params): Promise<DataState<FactoryItemModel>> {
    return CloneFactoryItemsRepo.getInstance().call(params)
  }
}
