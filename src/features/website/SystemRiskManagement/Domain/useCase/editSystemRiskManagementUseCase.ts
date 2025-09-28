import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type SystemRiskManagementModel from '../../Data/models/SystemRiskManagementModel'
import { EditSystemRiskManagementRepo } from '../repositories/editSystemRiskManagementRepo'





export default class EditSystemRiskManagementUseCase implements UseCase<SystemRiskManagementModel, Params> {
  async call(params: Params): Promise<DataState<SystemRiskManagementModel>> {
    return EditSystemRiskManagementRepo.getInstance().call(params)
  }
}
