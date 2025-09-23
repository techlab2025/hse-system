import type Params from "@/base/core/params/params";
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import type AccidentsTypeModel from "../../Data/models/OrganizationModel";
import { IndexAccidentsTypeRepo } from "../repositories/indexOrganizationRepo";

export default class IndexAccidentsTypeUseCase
  implements UseCase<AccidentsTypeModel[], Params>
{
  async call(params: Params): Promise<DataState<AccidentsTypeModel[]>> {
    return IndexAccidentsTypeRepo.getInstance().call(params);
  }
}
