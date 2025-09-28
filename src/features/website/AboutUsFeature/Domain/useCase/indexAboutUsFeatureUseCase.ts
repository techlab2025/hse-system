import type Params from "@/base/core/params/params";
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import { IndexAboutUsFeatureRepo } from "../repositories/indexAboutUsFeatureRepo";
import type AboutUsFeatureModel from "../../Data/models/AboutUsFeatureModel";





export default class IndexAboutUsFeatureUseCase
  implements UseCase<AboutUsFeatureModel[], Params> {
  async call(params: Params): Promise<DataState<AboutUsFeatureModel[]>> {
    return IndexAboutUsFeatureRepo.getInstance().call(params);
  }
}
