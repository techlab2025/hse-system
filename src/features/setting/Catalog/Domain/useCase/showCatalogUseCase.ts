import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ShowCatalogRepo } from '../repositories/showCatalogRepo'
import type CatalogDetailsModel from '../../Data/models/CatalogDetailsModel'

export default class ShowCatalogUseCase implements UseCase<CatalogDetailsModel, Params> {
  async call(params: Params): Promise<DataState<CatalogDetailsModel>> {
    return ShowCatalogRepo.getInstance().call(params)
  }
}
