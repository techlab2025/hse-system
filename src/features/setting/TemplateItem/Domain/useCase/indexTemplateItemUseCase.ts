import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type TemplateItemModel from '../../Data/models/TemplateItemModel'
import { IndexTemplateItemRepo } from '../repositories/indexTemplateItemRepo'

export default class IndexTemplateItemUseCase implements UseCase<TemplateItemModel[], Params> {
  async call(params: Params): Promise<DataState<TemplateItemModel[]>> {
    return IndexTemplateItemRepo.getInstance().call(params)
  }
}
