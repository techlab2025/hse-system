import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ToggleObservationActionStatusRepo } from '../repositories/ToggleObservationActionStatusRepo'
import type HazardModel from '../../Data/models/hazardModel'
import type Params from '@/base/core/params/params'

export default class ToggleObservationActionStatusUseCase implements UseCase<HazardModel, Params> {
  async call(params: Params): Promise<DataState<HazardModel>> {
    return ToggleObservationActionStatusRepo.getInstance().call(params)
  }
}
