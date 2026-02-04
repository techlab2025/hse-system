import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { EditCatalogItemsRepo } from '../repositories/editCatalogRepo'
// import type CatalogModel from '../../Data/models/CatalogItemsModel'
import type CatalogItemsModel from '../../Data/models/CatalogItemsModel'

export default class EditCatalogItemsUseCase implements UseCase<CatalogItemsModel, Params> {
  async call(params: Params): Promise<DataState<CatalogItemsModel>> {
    return EditCatalogItemsRepo.getInstance().call(params)
  }
}
