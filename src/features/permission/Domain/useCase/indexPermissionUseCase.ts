import type Params from "@/base/core/params/params";
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import type PermissionModel from "../../Data/models/PermissionModel";
import { IndexPermissionRepo } from "../repositories/indexPermissionRepo";


export default class IndexPermissionUseCase
  implements UseCase<PermissionModel[], Params> {
  async call(params: Params): Promise<DataState<PermissionModel[]>> {
    return IndexPermissionRepo.getInstance().call(params);
  }
}
