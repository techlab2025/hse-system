import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ShowHealthConditionsRepo } from '@/features/setting/HealthConditions/Domain/repositories/showHealthConditionsRepo'
import HealthConditionsDetailsModel from '@/features/setting/HealthConditions/Data/models/healthConditionsDetailsModel'

export default class ShowHealthConditionsUseCase
  implements UseCase<HealthConditionsDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<HealthConditionsDetailsModel>> {
    return ShowHealthConditionsRepo.getInstance().call(params)
  }
}
