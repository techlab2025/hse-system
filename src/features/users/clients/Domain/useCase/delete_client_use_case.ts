import type Params from "@/base/core/params/params";
import type ClientModel from "@/features/users/clients/Data/models/index_client_model";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import { DeleteClientRepo } from "@/features/users/clients/Domain/repositories/delete_client_repo";

export default class DeleteClientUseCase
  implements UseCase<ClientModel, Params>
{
  async call(params: Params): Promise<DataState<ClientModel>> {
    return DeleteClientRepo.getInstance().call(params);
  }
}
