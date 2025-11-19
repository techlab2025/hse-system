import type Params from "@/base/core/params/params";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import { IndexHazardRepo } from "../repositories/indexHazardRepo";
import type HazardModel from "../../Data/models/hazardModel";

export default class IndexHazardUseCase
  implements UseCase<HazardModel[], Params>
{
  async call(params: Params): Promise<DataState<HazardModel[]>> {
    return IndexHazardRepo.getInstance().call(params);
  }
}
