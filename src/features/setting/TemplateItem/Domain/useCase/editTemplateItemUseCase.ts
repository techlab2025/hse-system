import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type TemplateItemModel from '../../Data/models/TemplateItemModel'
import { EditTemplateItemRepo } from '../repositories/editTemplateItemRepo'

export default class EditTemplateItemUseCase implements UseCase<TemplateItemModel, Params> {
  async call(params: Params): Promise<DataState<TemplateItemModel>> {
    return EditTemplateItemRepo.getInstance().call(params)
  }
}
