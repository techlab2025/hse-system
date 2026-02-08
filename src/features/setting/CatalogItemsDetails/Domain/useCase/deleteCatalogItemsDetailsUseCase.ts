import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DeleteCatalogItemsDetailsRepo } from '../repositories/deleteCatalogDetailsRepo'
// import type CatalogModel from '../../Data/models/CatalogItemsModel'
import type CatalogItemsModel from '../../Data/models/CatalogItemsModel'

export default class DeleteCatalogItemsDetailsUseCase implements UseCase<CatalogItemsModel, Params> {
  async call(params: Params): Promise<DataState<CatalogItemsModel>> {
    return DeleteCatalogItemsDetailsRepo.getInstance().call(params)
  }
}
