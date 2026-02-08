import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { IndexCatalogItemsDetailsRepo } from '../repositories/indexCatalogDetailsRepo'
// import type CatalogModel from '../../Data/models/CatalogItemsModel'
import type CatalogItemsModel from '../../Data/models/CatalogItemsModel'

export default class IndexCatalogItemsDetailsUseCase implements UseCase<CatalogItemsModel[], Params> {
  async call(params: Params): Promise<DataState<CatalogItemsModel[]>> {
    return IndexCatalogItemsDetailsRepo.getInstance().call(params)
  }
}
