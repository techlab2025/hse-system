import type Params from "@/base/core/params/params";
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import { IndexScopeRepo } from "../repositories/indexScopeRepo";
import type ScopeModel from "../../Data/models/ScopeModel";


export default class IndexScopeUseCase
  implements UseCase<ScopeModel[], Params> {
  async call(params: Params): Promise<DataState<ScopeModel[]>> {
    return IndexScopeRepo.getInstance().call(params);
  }
}
