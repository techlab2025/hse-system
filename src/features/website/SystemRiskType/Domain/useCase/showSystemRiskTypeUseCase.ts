import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type SystemRiskTypeDetailsModel from '../../Data/models/SystemRiskTypeDetailsModel'
import { ShowSystemRiskTypeRepo } from '../repositories/showSystemRiskTypeRepo'

export default class ShowSystemRiskTypeUseCase
  implements UseCase<SystemRiskTypeDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<SystemRiskTypeDetailsModel>> {
    return ShowSystemRiskTypeRepo.getInstance().call(params)
  }
}
