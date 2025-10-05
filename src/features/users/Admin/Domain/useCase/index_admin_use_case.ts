import type Params from "@/base/core/params/params";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import type AdminModel from "../../Data/models/index_admin_model";
import { IndexAdminRepo } from "../repositories/index_admin_repo";

export default class IndexAdminUseCase
  implements UseCase<AdminModel[], Params> {
  async call(params: Params): Promise<DataState<AdminModel[]>> {
    return IndexAdminRepo.getInstance().call(params);
  }
}
