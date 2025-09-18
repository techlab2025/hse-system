import type Params from "@/base/core/params/params";
import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import { IndexLangRepo } from "@/features/setting/languages/Domain/repositories/indexLangRepo";

export default class IndexLangUseCase
  implements UseCase<LangModel[], Params>
{
  async call(params: Params): Promise<DataState<LangModel[]>> {
    return IndexLangRepo.getInstance().call(params);
  }
}
