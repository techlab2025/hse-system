import type Params from "@/base/core/params/params";
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import type InjuryModel from "../../Data/models/InjuryModel";
import { IndexInjuryRepo } from "../repositories/indexInjuryRepo";


export default class IndexInjuryUseCase
  implements UseCase<InjuryModel[], Params> {
  async call(params: Params): Promise<DataState<InjuryModel[]>> {
    return IndexInjuryRepo.getInstance().call(params);
  }
}
