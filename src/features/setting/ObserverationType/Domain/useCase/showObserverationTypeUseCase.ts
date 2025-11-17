import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ShowObserverationTypeRepo } from '@/features/setting/ObserverationType/Domain/repositories/showObserverationTypeRepo'
import ObserverationTypeDetailsModel from '@/features/setting/ObserverationType/Data/models/observerationTypeDetailsModel'

export default class ShowObserverationTypeUseCase
  implements UseCase<ObserverationTypeDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<ObserverationTypeDetailsModel>> {
    return ShowObserverationTypeRepo.getInstance().call(params)
  }
}
