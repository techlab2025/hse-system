import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ShowSystemRiskManagementRepo } from '../repositories/showSystemRiskManagementRepo'
import type SystemRiskManagementDetailsModel from '../../Data/models/SystemRiskManagementDetailsModel'



export default class ShowSystemRiskManagementUseCase
  implements UseCase<SystemRiskManagementDetailsModel, Params> {
  async call(params: Params): Promise<DataState<SystemRiskManagementDetailsModel>> {
    return ShowSystemRiskManagementRepo.getInstance().call(params)
  }
}
