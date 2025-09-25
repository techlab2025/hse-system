import type Params from "@/base/core/params/params";
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import type HomeAboutUsModel from "../../Data/models/HomeAboutUsModel";
import { IndexHomeAboutUsRepo } from "../repositories/indexHomeAboutUsRepo";



export default class IndexHomeAboutUsUseCase
  implements UseCase<HomeAboutUsModel[], Params> {
  async call(params: Params): Promise<DataState<HomeAboutUsModel[]>> {
    return IndexHomeAboutUsRepo.getInstance().call(params);
  }
}
