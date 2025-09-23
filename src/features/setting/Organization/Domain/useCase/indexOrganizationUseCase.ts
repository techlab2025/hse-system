import type Params from "@/base/core/params/params";
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import type OrganizationModel from "../../Data/models/OrganizationModel";
import { IndexOrganizationRepo } from "../repositories/indexOrganizationRepo";

export default class IndexOrganizationUseCase
  implements UseCase<OrganizationModel[], Params>
{
  async call(params: Params): Promise<DataState<OrganizationModel[]>> {
    return IndexOrganizationRepo.getInstance().call(params);
  }
}
