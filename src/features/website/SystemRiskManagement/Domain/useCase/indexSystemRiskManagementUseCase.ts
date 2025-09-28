import type Params from "@/base/core/params/params";
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import { IndexSystemRiskManagementRepo } from "../repositories/indexSystemRiskManagementRepo";
import type SystemRiskManagementModel from "../../Data/models/SystemRiskManagementModel";





export default class IndexSystemRiskManagementUseCase
  implements UseCase<SystemRiskManagementModel[], Params> {
  async call(params: Params): Promise<DataState<SystemRiskManagementModel[]>> {
    return IndexSystemRiskManagementRepo.getInstance().call(params);
  }
}
