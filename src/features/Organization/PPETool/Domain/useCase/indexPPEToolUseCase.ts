import type Params from "@/base/core/params/params";
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import { IndexPPEToolRepo } from "../repositories/indexPPEToolRepo";
import PPEToolModel from "../../Data/models/PPEToolModel";

export default class IndexPPEToolUseCase
  implements UseCase<PPEToolModel[], Params> {
  async call(params: Params): Promise<DataState<PPEToolModel[]>> {
    return IndexPPEToolRepo.getInstance().call(params)
  }
}
