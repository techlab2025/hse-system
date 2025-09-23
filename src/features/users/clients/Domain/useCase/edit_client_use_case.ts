import type Params from "@/base/core/params/params";
import type ClientModel from "@/features/users/clients/Data/models/index_client_model";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import { EditClientRepo } from "@/features/users/clients/Domain/repositories/edit_client_repo";

export default class EditClientUseCase implements UseCase<ClientModel, Params> {
  async call(params: Params): Promise<DataState<ClientModel>> {
    return EditClientRepo.getInstance().call(params);
  }
}
