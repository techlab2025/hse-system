import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type TemplateItemDetailsModel from '../../Data/models/equipmentDetailsModel'
import { ShowTemplateItemRepo } from '../repositories/showTemplateItemRepo'

export default class ShowTemplateItemUseCase implements UseCase<TemplateItemDetailsModel, Params> {
  async call(params: Params): Promise<DataState<TemplateItemDetailsModel>> {
    return ShowTemplateItemRepo.getInstance().call(params)
  }
}
