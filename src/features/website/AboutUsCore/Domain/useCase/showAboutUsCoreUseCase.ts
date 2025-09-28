import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type AboutUsCoreDetailsModel from '../../Data/models/AboutUsCoreDetailsModel'
import { ShowAboutUsCoreRepo } from '../repositories/showAboutUsCoreRepo'



export default class ShowAboutUsCoreUseCase
  implements UseCase<AboutUsCoreDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<AboutUsCoreDetailsModel>> {
    return ShowAboutUsCoreRepo.getInstance().call(params)
  }
}
