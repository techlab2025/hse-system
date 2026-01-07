import type Params from "@/base/core/params/params";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import type InspectionModel from "../../Data/models/InspectionModel";
import { FetchInspectionsResultsRepo } from "../repositories/FecthInspectionsResultsRepo";

export default class FetchInspectionsResultsUseCase
  implements UseCase<InspectionModel[], Params> {
  async call(params: Params): Promise<DataState<InspectionModel[]>> {
    return FetchInspectionsResultsRepo.getInstance().call(params);
  }
}
