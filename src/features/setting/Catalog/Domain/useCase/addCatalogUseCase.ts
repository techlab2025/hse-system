import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { AddCatalogRepo } from '../repositories/addCatalogRepo'
import type CatalogModel from '../../Data/models/CatalogModel'

export default class AddCatalogUseCase implements UseCase<CatalogModel, Params> {
  async call(params: Params): Promise<DataState<CatalogModel>> {
    return AddCatalogRepo.getInstance().call(params)
  }
}
