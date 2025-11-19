import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { AddHazardRepo } from '../repositories/addHazardRepo'
import type HazardModel from '../../Data/models/hazardModel'
import type Params from '@/base/core/params/params'

export default class AddHazardUseCase implements UseCase<HazardModel, Params> {
  async call(params: Params): Promise<DataState<HazardModel>> {
    return AddHazardRepo.getInstance().call(params)
  }
}
