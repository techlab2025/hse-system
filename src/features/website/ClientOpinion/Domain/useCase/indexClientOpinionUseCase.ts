import type Params from "@/base/core/params/params";
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import type ClientOpinionModel from "../../Data/models/ClientOpinionModel";
import { IndexClientOpinionRepo } from "../repositories/indexClientOpinionRepo";


export default class IndexClientOpinionUseCase
  implements UseCase<ClientOpinionModel[], Params>
{
  async call(params: Params): Promise<DataState<ClientOpinionModel[]>> {
    return IndexClientOpinionRepo.getInstance().call(params);
  }
}
