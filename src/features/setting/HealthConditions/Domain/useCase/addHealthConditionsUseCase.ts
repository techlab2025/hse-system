import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { AddHealthConditionsRepo } from '@/features/setting/HealthConditions/Domain/repositories/addHealthConditionsRepo.ts'
import type HealthConditionsModel from '@/features/setting/HealthConditions/Data/models/healthConditionsModel'

export default class AddHealthConditionsUseCase implements UseCase<HealthConditionsModel, Params> {
  async call(params: Params): Promise<DataState<HealthConditionsModel>> {
    return AddHealthConditionsRepo.getInstance().call(params)
  }
}
