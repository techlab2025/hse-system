import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ShowCatalogItemsDetailsRepo } from '../repositories/showCatalogDetailsRepo'
// import type CatalogDetailsModel from '../../Data/models/CatalogItemsDetailsModel'
import type CatalogItemsDetailsModel from '../../Data/models/CatalogItemsDetailsModel'

export default class ShowCatalogItemsDetailsUseCase implements UseCase<CatalogItemsDetailsModel, Params> {
  async call(params: Params): Promise<DataState<CatalogItemsDetailsModel>> {
    return ShowCatalogItemsDetailsRepo.getInstance().call(params)
  }
}
