import type Params from "@/base/core/params/params";
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from "@/base/Domain/UseCase/use_case";
import { DataSuccess, type DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import { IndexWhereHouseTypeRepo } from "../repositories/indexWhereHouseTypeRepo";
import WhereHouseTypeModel from "../../Data/models/WhereHouseTypeModel";
import { UseCaseHandler } from "@/base/Domain/UseCase/use_case";

export default class IndexWhereHouseTypeUseCase
  implements UseCase<WhereHouseTypeModel[], Params> {
  async call(params: Params): Promise<DataState<WhereHouseTypeModel[]>> {
    return UseCaseHandler.instance().handle({
      onTest: () => {
        return new DataSuccess({ data: WhereHouseTypeModel.example })
      },
      onDev: () => {
        return IndexWhereHouseTypeRepo.getInstance().call(params)
      },
      onProduction: () => {
        return IndexWhereHouseTypeRepo.getInstance().call(params)
      },
    })
  }
}
