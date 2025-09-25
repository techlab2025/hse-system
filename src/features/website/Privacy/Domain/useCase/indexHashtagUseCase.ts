import type Params from "@/base/core/params/params";
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import type HashtagModel from "../../Data/models/PrivacyModel";
import { IndexHashtagRepo } from "../repositories/indexHashtagRepo";


export default class IndexHashtagUseCase
  implements UseCase<HashtagModel[], Params> {
  async call(params: Params): Promise<DataState<HashtagModel[]>> {
    return IndexHashtagRepo.getInstance().call(params);
  }
}
