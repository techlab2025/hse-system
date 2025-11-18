import type Params from "@/base/core/params/params";
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import { IndexHazardTypeRepo } from "@/features/setting/HazardType/Domain/repositories/indexHazardTypeRepo";
import type HazardTypeModel from '@/features/setting/HazardType/Data/models/hazardTypeModel'

export default class IndexHazardTypeUseCase
  implements UseCase<HazardTypeModel[], Params>
{
  async call(params: Params): Promise<DataState<HazardTypeModel[]>> {
    return IndexHazardTypeRepo.getInstance().call(params);
  }
}
