import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ShowAboutUsFeatureRepo } from '../repositories/showAboutUsFeatureRepo'
import type AboutUsFeatureDetailsModel from '../../Data/models/AboutUsFeatureDetailsModel'



export default class ShowAboutUsFeatureUseCase
  implements UseCase<AboutUsFeatureDetailsModel, Params> {
  async call(params: Params): Promise<DataState<AboutUsFeatureDetailsModel>> {
    return ShowAboutUsFeatureRepo.getInstance().call(params)
  }
}
