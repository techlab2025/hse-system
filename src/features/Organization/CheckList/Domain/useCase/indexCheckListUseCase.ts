import type Params from "@/base/core/params/params";
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from "@/base/Domain/UseCase/use_case";
import { DataSuccess, type DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import { IndexCheckListRepo } from "../repositories/indexCheckListRepo";
import CheckListDetailsModel from "../../Data/models/CheckListModel";
import { UseCaseHandler } from "@/base/Domain/UseCase/use_case";

export default class IndexCheckListUseCase
  implements UseCase<CheckListDetailsModel[], Params> {
  async call(params: Params): Promise<DataState<CheckListDetailsModel[]>> {
    return UseCaseHandler.instance().handle({
      onTest: () => {
        return new DataSuccess({ data: CheckListDetailsModel.example })
      },
      onDev: () => {
        return IndexCheckListRepo.getInstance().call(params)
      },
      onProduction: () => {
        return IndexCheckListRepo.getInstance().call(params)
      },
    })
  }
}
