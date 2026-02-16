import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ToggleObservationWorkStoppedRepo } from '../repositories/ToggleObservationWorkStoppedRepo'
import type HazardModel from '../../Data/models/hazardModel'
import type Params from '@/base/core/params/params'

export default class ToggleObservationWorkStoppedUseCase implements UseCase<HazardModel, Params> {
  async call(params: Params): Promise<DataState<HazardModel>> {
    return ToggleObservationWorkStoppedRepo.getInstance().call(params)
  }
}
