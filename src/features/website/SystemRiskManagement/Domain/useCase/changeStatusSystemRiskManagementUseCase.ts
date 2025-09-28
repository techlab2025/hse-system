import type Params from '@/base/core/params/params'
// import type LangModel from '@/features/setting/languages/Data/models/langModel'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type SystemRiskManagementModel from '../../Data/models/SystemRiskManagementModel'
import { ChangeStatusSystemRiskManagementRepo } from '../repositories/changeStatusSystemRiskManagementRepo'





export default class ChangeStatusSystemRiskManagementUseCase implements UseCase<SystemRiskManagementModel, Params> {
  async call(params: Params): Promise<DataState<SystemRiskManagementModel>> {
    return ChangeStatusSystemRiskManagementRepo.getInstance().call(params)
  }
}
