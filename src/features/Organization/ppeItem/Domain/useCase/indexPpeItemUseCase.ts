import type Params from "@/base/core/params/params";
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import { IndexPpeItemRepo } from "../repositories/indexPpeItemRepo";
import PpeItemModel from "../../Data/models/PpeItemModel";

export default class IndexPpeItemUseCase
  implements UseCase<PpeItemModel[], Params> {
  async call(params: Params): Promise<DataState<PpeItemModel[]>> {
    return IndexPpeItemRepo.getInstance().call(params)
  }
}
