import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { EditHealthConditionsRepo } from '@/features/setting/HealthConditions/Domain/repositories/editHealthConditionsRepo'
import type HealthConditionsModel from '@/features/setting/HealthConditions/Data/models/healthConditionsModel'

export default class EditHealthConditionsUseCase implements UseCase<HealthConditionsModel, Params> {
  async call(params: Params): Promise<DataState<HealthConditionsModel>> {
    return EditHealthConditionsRepo.getInstance().call(params)
  }
}
