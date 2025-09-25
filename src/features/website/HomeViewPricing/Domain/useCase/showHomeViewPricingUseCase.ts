import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type HomeViewPricingDetailsModel from '../../Data/models/HomeViewPricingDetailsModel'
import { ShowHomeViewPricingRepo } from '../repositories/showHomeViewPricingRepo'




export default class ShowHomeViewPricingUseCase
  implements UseCase<HomeViewPricingDetailsModel, Params> {
  async call(params: Params): Promise<DataState<HomeViewPricingDetailsModel>> {
    return ShowHomeViewPricingRepo.getInstance().call(params)
  }
}
