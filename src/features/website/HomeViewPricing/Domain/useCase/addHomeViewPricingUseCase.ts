import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type HomeViewPricingModel from '../../Data/models/HomeViewPricingModel'
import { AddHomeViewPricingRepo } from '../repositories/addHomeViewPricingRepo'






export default class AddHomeViewPricingUseCase implements UseCase<HomeViewPricingModel, Params> {
  async call(params: Params): Promise<DataState<HomeViewPricingModel>> {
    return AddHomeViewPricingRepo.getInstance().call(params)
  }
}
