import type Params from "@/base/core/params/params";
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import { IndexPTWTypeRepo } from "../repositories/indexPTWTypeRepo";
import PTWTypeModel from "../../Data/models/PTWTypeModel";

export default class IndexPTWTypeUseCase
  implements UseCase<PTWTypeModel[], Params> {
  async call(params: Params): Promise<DataState<PTWTypeModel[]>> {
    return IndexPTWTypeRepo.getInstance().call(params)
  }
}
