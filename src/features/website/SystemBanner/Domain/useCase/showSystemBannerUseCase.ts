import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type SystemBannerDetailsModel from '../../Data/models/SystemBannerDetailsModel'
import { ShowSystemBannerRepo } from '../repositories/showSystemBannerRepo'

export default class ShowSystemBannerUseCase
  implements UseCase<SystemBannerDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<SystemBannerDetailsModel>> {
    return ShowSystemBannerRepo.getInstance().call(params)
  }
}
