import type Params from "@/base/core/params/params";
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import type OurSystemStepModel from "../../Data/models/OurSystemStepModel";
import { IndexOurSystemStepRepo } from "../repositories/indexOurSystemStepRepo";


export default class IndexOurSystemStepUseCase
  implements UseCase<OurSystemStepModel[], Params> {
  async call(params: Params): Promise<DataState<OurSystemStepModel[]>> {
    return IndexOurSystemStepRepo.getInstance().call(params);
  }
}
