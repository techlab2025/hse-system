import type Params from "@/base/core/params/params";
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import { IndexPowerFullRepo } from "../repositories/indexPowerFullRepo";
import type PowerFullModel from "../../Data/models/PowerFullModel";




export default class IndexPowerFullUseCase
  implements UseCase<PowerFullModel[], Params> {
  async call(params: Params): Promise<DataState<PowerFullModel[]>> {
    return IndexPowerFullRepo.getInstance().call(params);
  }
}
