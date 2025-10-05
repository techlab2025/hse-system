import type Params from "@/base/core/params/params";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import type ShowAdminModel from "../../Data/models/show_admin_model";
import { ShowAdminRepo } from "../repositories/show_admin_repo";

export default class ShowAdminUseCase
  implements UseCase<ShowAdminModel, Params>
{
  async call(params: Params): Promise<DataState<ShowAdminModel>> {
    return ShowAdminRepo.getInstance().call(params);
  }
}
