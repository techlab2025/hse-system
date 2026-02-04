import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DeleteCatalogItemsRepo } from '../repositories/deleteCatalogRepo'
// import type CatalogModel from '../../Data/models/CatalogItemsModel'
import type CatalogItemsModel from '../../Data/models/CatalogItemsModel'

export default class DeleteCatalogItemsUseCase implements UseCase<CatalogItemsModel, Params> {
  async call(params: Params): Promise<DataState<CatalogItemsModel>> {
    return DeleteCatalogItemsRepo.getInstance().call(params)
  }
}
