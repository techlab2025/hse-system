import type Params from '@/base/core/params/params'
import type ObservationModel from '@/features/setting/Observation/Data/models/observationModel'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DeleteObservationRepo } from '@/features/setting/Observation/Domain/repositories/deleteObservationRepo'

export default class DeleteObservationUseCase implements UseCase<ObservationModel, Params> {
  async call(params: Params): Promise<DataState<ObservationModel>> {
    return DeleteObservationRepo.getInstance().call(params)
  }
}
