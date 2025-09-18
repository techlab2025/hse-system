import type Params from "@/base/core/params/params";
import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import { ShowLangRepo } from "@/features/setting/languages/Domain/repositories/showLangRepo";

export default class ShowLangUseCase
  implements UseCase<ShowLangModel, Params>
{
  async call(params: Params): Promise<DataState<ShowLangModel>> {
    return ShowLangRepo.getInstance().call(params);
  }
}


