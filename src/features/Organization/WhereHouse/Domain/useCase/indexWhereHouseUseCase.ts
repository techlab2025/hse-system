import type Params from "@/base/core/params/params";
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from "@/base/Domain/UseCase/use_case";
import { DataSuccess, type DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import { IndexWhereHouseRepo } from "../repositories/indexWhereHouseRepo";
import WhereHouseModel from "../../Data/models/WhereHouseModel";
import { UseCaseHandler } from "@/base/Domain/UseCase/use_case";

export default class IndexWhereHouseUseCase
  implements UseCase<WhereHouseModel[], Params> {
  async call(params: Params): Promise<DataState<WhereHouseModel[]>> {
    return UseCaseHandler.instance().handle({
      onTest: () => {
        return new DataSuccess({ data: WhereHouseModel.example })
      },
      onDev: () => {
        return IndexWhereHouseRepo.getInstance().call(params)
      },
      onProduction: () => {
        return IndexWhereHouseRepo.getInstance().call(params)
      },
    })
  }
}
