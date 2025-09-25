import type Params from "@/base/core/params/params";
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import type ServiceModel from "../../Data/models/ServiceModel";
import { IndexServiceRepo } from "../repositories/indexServiceRepo";



export default class IndexServiceUseCase
  implements UseCase<ServiceModel[], Params>
{
  async call(params: Params): Promise<DataState<ServiceModel[]>> {
    return IndexServiceRepo.getInstance().call(params);
  }
}
