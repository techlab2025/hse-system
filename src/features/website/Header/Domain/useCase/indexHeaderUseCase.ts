import type Params from "@/base/core/params/params";
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import type HeaderModel from "../../Data/models/HeaderModel";
import { IndexHeaderRepo } from "../repositories/indexHeaderRepo";



export default class IndexHeaderUseCase
  implements UseCase<HeaderModel[], Params> {
  async call(params: Params): Promise<DataState<HeaderModel[]>> {
    return IndexHeaderRepo.getInstance().call(params);
  }
}
