import type Params from "@/base/core/params/params";
import type ClientModel from "@/features/dashboard/users/clients/Data/models/index_client_model";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import { AddClientRepo } from "@/features/dashboard/users/clients/Domain/repositories/add_client_repo";

export default class AddClientUseCase implements UseCase<ClientModel, Params> {
  async call(params: Params): Promise<DataState<ClientModel>> {
    return AddClientRepo.getInstance().call(params);
  }
}
