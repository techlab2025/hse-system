import type Params from "@/base/core/params/params";
import type ClientModel from "@/features/dashboard/users/clients/Data/models/index_client_model";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import { IndexClientRepo } from "@/features/dashboard/users/clients/Domain/repositories/index_clients_repo";

export default class IndexClientUseCase
  implements UseCase<ClientModel[], Params>
{
  async call(params: Params): Promise<DataState<ClientModel[]>> {
    return IndexClientRepo.getInstance().call(params);
  }
}
