import type Params from "@/base/core/params/params";
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import type SystemWorkModel from "../../Data/models/SystemWorkModel";
import { IndexSystemWorkRepo } from "../repositories/indexSystemWorkRepo";





export default class IndexSystemWorkUseCase
  implements UseCase<SystemWorkModel[], Params> {
  async call(params: Params): Promise<DataState<SystemWorkModel[]>> {
    return IndexSystemWorkRepo.getInstance().call(params);
  }
}
