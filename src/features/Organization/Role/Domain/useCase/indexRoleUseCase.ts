import type Params from "@/base/core/params/params";
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import type RoleModel from "../../Data/models/RoleModel";
import { IndexRoleRepo } from "../repositories/indexRoleRepo";


export default class IndexRoleUseCase
  implements UseCase<RoleModel[], Params> {
  async call(params: Params): Promise<DataState<RoleModel[]>> {
    return IndexRoleRepo.getInstance().call(params);
  }
}
