import type Params from "@/base/core/params/params";
import type ShowClientModel from "@/features/users/clients/Data/models/show_client_model";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import { ShowClientRepo } from "@/features/users/clients/Domain/repositories/show_client_repo";

export default class ShowClientUseCase
  implements UseCase<ShowClientModel, Params>
{
  async call(params: Params): Promise<DataState<ShowClientModel>> {
    return ShowClientRepo.getInstance().call(params);
  }
}
