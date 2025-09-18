import type Params from "@/base/core/params/params";
import type ClientModel from "@/features/dashboard/users/languages/Data/models/index_client_model";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import { AcceptClientRepo } from "@/features/dashboard/users/languages/Domain/repositories/accept_client_repo";

export default class AcceptClientUseCase
  implements UseCase<ClientModel, Params>
{
  async call(params: Params): Promise<DataState<ClientModel>> {
    return AcceptClientRepo.getInstance().call(params);
  }
}
