import type Params from "@/base/core/params/params";
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import type FaqModel from "../../Data/models/FaqModel";
import { IndexFaqRepo } from "../repositories/indexFaqRepo";


export default class IndexFaqUseCase
  implements UseCase<FaqModel[], Params> {
  async call(params: Params): Promise<DataState<FaqModel[]>> {
    return IndexFaqRepo.getInstance().call(params);
  }
}
