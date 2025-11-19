import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ShowHazardRepo } from '../repositories/showHazardRepo'
import type HazardDetailsModel from '../../Data/models/hazardDetailsModel'

export default class ShowHazardUseCase implements UseCase<HazardDetailsModel, Params> {
  async call(params: Params): Promise<DataState<HazardDetailsModel>> {
    return ShowHazardRepo.getInstance().call(params)
  }
}
