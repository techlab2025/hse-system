import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DeleteCatalogRepo } from '../repositories/deleteCatalogRepo'
import type CatalogModel from '../../Data/models/CatalogModel'

export default class DeleteCatalogUseCase implements UseCase<CatalogModel, Params> {
  async call(params: Params): Promise<DataState<CatalogModel>> {
    return DeleteCatalogRepo.getInstance().call(params)
  }
}
