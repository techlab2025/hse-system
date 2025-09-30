import type Params from "@/base/core/params/params";
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import type ProjectZoneModel from "../../Data/models/ProjectZoneModel";
import { IndexProjectZoneRepo } from "../repositories/indexProjectZoneRepo";





export default class IndexProjectZoneUseCase
  implements UseCase<ProjectZoneModel[], Params> {
  async call(params: Params): Promise<DataState<ProjectZoneModel[]>> {
    return IndexProjectZoneRepo.getInstance().call(params);
  }
}
