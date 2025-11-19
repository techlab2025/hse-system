import type Params from "@/base/core/params/params";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import type InspectionModel from "../../Data/models/InspectionModel";
import { IndexInspectionRepo } from "../repositories/indexInspectionRepo";

export default class IndexInspectionUseCase
  implements UseCase<InspectionModel[], Params> {
  async call(params: Params): Promise<DataState<InspectionModel[]>> {
    return IndexInspectionRepo.getInstance().call(params);
  }
}
