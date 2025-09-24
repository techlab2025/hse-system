import type Params from "@/base/core/params/params";
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import type TemplateModel from "../../Data/models/TemplateModel";
import { IndexTemplateRepo } from "../repositories/indexTemplateRepo";


export default class IndexTemplateUseCase
  implements UseCase<TemplateModel[], Params>
{
  async call(params: Params): Promise<DataState<TemplateModel[]>> {
    return IndexTemplateRepo.getInstance().call(params);
  }
}
