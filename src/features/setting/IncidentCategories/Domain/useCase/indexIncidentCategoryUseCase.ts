import type Params from "@/base/core/params/params";
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import type IncidentCategoryModel from "../../Data/models/IncidentCategoryModel";
import { IndexIncidentCategoryRepo } from "../repositories/indexIncidentCategoryRepo";

export default class IndexIncidentCategoryUseCase
  implements UseCase<IncidentCategoryModel[], Params>
{
  async call(params: Params): Promise<DataState<IncidentCategoryModel[]>> {
    return IndexIncidentCategoryRepo.getInstance().call(params);
  }
}
