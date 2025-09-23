import type Params from "@/base/core/params/params";
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import type FactoryModel from "../../Data/models/FactoryModel";
import { IndexFactoryRepo } from "../repositories/indexFactoryRepo";


export default class IndexFactoryUseCase
  implements UseCase<FactoryModel[], Params>
{
  async call(params: Params): Promise<DataState<FactoryModel[]>> {
    return IndexFactoryRepo.getInstance().call(params);
  }
}
