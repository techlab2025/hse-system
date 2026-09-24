import type Params from "@/base/core/params/params";
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import { IndexPPEActivityRepo } from "../repositories/indexPPEActivityRepo";
import PPEActivityModel from "../../Data/models/PPEActivityModel";

export default class IndexPPEActivityUseCase
  implements UseCase<PPEActivityModel[], Params> {
  async call(params: Params): Promise<DataState<PPEActivityModel[]>> {
    return IndexPPEActivityRepo.getInstance().call(params)
  }
}
