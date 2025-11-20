import type Params from "@/base/core/params/params";
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import { IndexHealthConditionsRepo } from "@/features/setting/HealthConditions/Domain/repositories/indexHealthConditionsRepo";
import type HealthConditionsModel from '@/features/setting/HealthConditions/Data/models/healthConditionsModel'

export default class IndexHealthConditionsUseCase
  implements UseCase<HealthConditionsModel[], Params>
{
  async call(params: Params): Promise<DataState<HealthConditionsModel[]>> {
    return IndexHealthConditionsRepo.getInstance().call(params);
  }
}
