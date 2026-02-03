import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { IndexCatalogRepo } from '../repositories/indexCatalogRepo'
import type CatalogModel from '../../Data/models/CatalogModel'

export default class IndexCatalogUseCase implements UseCase<CatalogModel[], Params> {
  async call(params: Params): Promise<DataState<CatalogModel[]>> {
    return IndexCatalogRepo.getInstance().call(params)
  }
}
