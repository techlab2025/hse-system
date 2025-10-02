import type Params from "@/base/core/params/params";
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import type ProjectModel from "../../Data/models/ProjectModel";
import { IndexProjectRepo } from "../repositories/indexProjectRepo";


export default class IndexProjectUseCase
  implements UseCase<ProjectModel[], Params> {
  async call(params: Params): Promise<DataState<ProjectModel[]>> {
    return IndexProjectRepo.getInstance().call(params);
  }
}
