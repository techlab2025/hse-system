import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ShowObservationRepo } from '@/features/setting/Observation/Domain/repositories/showObservationRepo'
import ObservationDetailsModel from '@/features/setting/Observation/Data/models/observationDetailsModel'

export default class ShowObservationUseCase
  implements UseCase<ObservationDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<ObservationDetailsModel>> {
    return ShowObservationRepo.getInstance().call(params)
  }
}
