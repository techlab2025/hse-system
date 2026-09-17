import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { SimilarObservationRepo } from '../../repositories/SimilarObservation/SimilarObservationRepo'
import type Params from '@/base/core/params/params'
import type HazardDetailsModel from '@/features/Organization/ObservationFactory/Data/models/hazardDetailsModel'

export default class SimilarObservationUseCase implements UseCase<HazardDetailsModel[], Params> {
  async call(params: Params): Promise<DataState<HazardDetailsModel[]>> {
    return SimilarObservationRepo.getInstance().call(params)
  }
}
