import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DeleteHazardRepo } from '../repositories/deleteHazardRepo'
import type HazardModel from '../../Data/models/hazardModel'

export default class DeleteHazardUseCase implements UseCase<HazardModel, Params> {
  async call(params: Params): Promise<DataState<HazardModel>> {
    return DeleteHazardRepo.getInstance().call(params)
  }
}
