import type Params from '@/base/core/params/params'
// import type LangModel from '@/features/setting/languages/Data/models/langModel'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type HomeViewPricingModel from '../../Data/models/HomeViewPricingModel'
import { ChangeStatusHomeViewPricingRepo } from '../repositories/changeStatusHomeViewPricingRepo'






export default class ChangeStatusHomeViewPricingUseCase implements UseCase<HomeViewPricingModel, Params> {
  async call(params: Params): Promise<DataState<HomeViewPricingModel>> {
    return ChangeStatusHomeViewPricingRepo.getInstance().call(params)
  }
}
