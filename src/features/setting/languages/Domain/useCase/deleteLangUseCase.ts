import type Params from "@/base/core/params/params";
import type ClientModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import { DeleteLangRepo } from "@/features/setting/languages/Domain/repositories/deleteLangRepo";

export default class DeleteClientUseCase
  implements UseCase<ClientModel, Params>
{
  async call(params: Params): Promise<DataState<ClientModel>> {
    return DeleteLangRepo.getInstance().call(params);
  }
}
