import type Params from "@/base/core/params/params";
import type ClientProjectModel from "@/features/users/clients/Data/models/client_projects_model";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import { ClientProjectRepo } from "@/features/users/clients/Domain/repositories/show_client_projects_repo";

export default class ClientProjectUseCase
  implements UseCase<ClientProjectModel, Params>
{
  async call(params: Params): Promise<DataState<ClientProjectModel>> {
    return ClientProjectRepo.getInstance().call(params);
  }
}
