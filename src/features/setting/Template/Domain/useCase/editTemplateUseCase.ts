import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type TemplateModel from '../../Data/models/TemplateModel'
import { EditTemplateRepo } from '../repositories/editTemplateRepo'


export default class EditTemplateUseCase implements UseCase<TemplateModel, Params> {
  async call(params: Params): Promise<DataState<TemplateModel>> {
    return EditTemplateRepo.getInstance().call(params)
  }
}
