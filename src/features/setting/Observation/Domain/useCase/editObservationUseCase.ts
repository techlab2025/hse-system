import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { EditObservationRepo } from '@/features/setting/Observation/Domain/repositories/editObservationRepo'
import type ObservationModel from '@/features/setting/Observation/Data/models/observationModel'

export default class EditObservationUseCase implements UseCase<ObservationModel, Params> {
  async call(params: Params): Promise<DataState<ObservationModel>> {
    return EditObservationRepo.getInstance().call(params)
  }
}
