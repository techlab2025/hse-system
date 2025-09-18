import type Params from "@/base/core/params/params";
import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import { AddLangRepo } from "@/features/setting/languages/Domain/repositories/addLangRepo.ts";

export default class AddClientUseCase implements UseCase<LangModel, Params> {
  async call(params: Params): Promise<DataState<LangModel>> {
    return AddLangRepo.getInstance().call(params);
  }
}
