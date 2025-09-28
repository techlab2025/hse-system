import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type SystemRiskTypeModel from '../../Data/models/SystemRiskTypeModel'
import { AddSystemRiskTypeRepo } from '../repositories/addSystemRiskTypeRepo'

export default class AddSystemRiskTypeUseCase implements UseCase<SystemRiskTypeModel, Params> {
  async call(params: Params): Promise<DataState<SystemRiskTypeModel>> {
    return AddSystemRiskTypeRepo.getInstance().call(params)
  }
}
