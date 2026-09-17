import type Params from "@/base/core/params/params";
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import { IndexDrillTypeRepo } from "../repositories/indexDrillTypeRepo";
import DrillTypeModel from "../../Data/models/DrillTypeModel";

export default class IndexDrillTypeUseCase
  implements UseCase<DrillTypeModel[], Params> {
  async call(params: Params): Promise<DataState<DrillTypeModel[]>> {
    return IndexDrillTypeRepo.getInstance().call(params)
  }
}
