import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type SystemRiskManagementModel from '../../Data/models/SystemRiskManagementModel'
import { AddSystemRiskManagementRepo } from '../repositories/addSystemRiskManagementRepo'




export default class AddSystemRiskManagementUseCase implements UseCase<SystemRiskManagementModel, Params> {
  async call(params: Params): Promise<DataState<SystemRiskManagementModel>> {
    return AddSystemRiskManagementRepo.getInstance().call(params)
  }
}
