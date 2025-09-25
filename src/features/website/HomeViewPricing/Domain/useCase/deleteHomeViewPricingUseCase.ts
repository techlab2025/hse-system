import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type HomeViewPricingModel from '../../Data/models/HomeViewPricingModel'
import { DeleteHomeViewPricingRepo } from '../repositories/deleteHomeViewPricingRepo'





export default class DeleteHomeViewPricingUseCase implements UseCase<HomeViewPricingModel, Params> {
  async call(params: Params): Promise<DataState<HomeViewPricingModel>> {
    return DeleteHomeViewPricingRepo.getInstance().call(params)
  }
}
