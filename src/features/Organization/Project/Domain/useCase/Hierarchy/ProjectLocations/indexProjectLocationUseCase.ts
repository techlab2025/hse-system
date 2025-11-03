import type Params from "@/base/core/params/params";
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import type ProjectLocationModel from "@/features/Organization/Project/Data/models/projectLocation";
import { IndexProjectLocationRepo } from "../../../repositories/Hierarchy/ProjectLocations/indexProjectLocationApiService";



export default class IndexProjectLocationUseCase
  implements UseCase<ProjectLocationModel[], Params> {
  async call(params: Params): Promise<DataState<ProjectLocationModel[]>> {
    return IndexProjectLocationRepo.getInstance().call(params);
  }
}
