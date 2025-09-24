import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type TemplateDetailsModel from '../../Data/models/TemplateDetailsModel'
import { ShowTemplateRepo } from '../repositories/showTemplateRepo'


export default class ShowTemplateUseCase
  implements UseCase<TemplateDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<TemplateDetailsModel>> {
    return ShowTemplateRepo.getInstance().call(params)
  }
}
