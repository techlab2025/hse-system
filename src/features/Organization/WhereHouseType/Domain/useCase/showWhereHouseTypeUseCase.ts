import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import {
  DataSuccess,
  type DataState,
} from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ShowWhereHouseTypeRepo } from '../repositories/showWhereHouseTypeRepo'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'
import WhereHouseTypeDetailsModel from '../../Data/models/WhereHouseTypeDetailsModel'

export default class ShowWhereHouseTypeUseCase
  implements UseCase<WhereHouseTypeDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<WhereHouseTypeDetailsModel>> {
    return UseCaseHandler.instance().handle({
      onTest: () => {
        return new DataSuccess({ data: WhereHouseTypeDetailsModel.example })
      },
      onDev: () => {
        return ShowWhereHouseTypeRepo.getInstance().call(params)
      },
      onProduction: () => {
        return ShowWhereHouseTypeRepo.getInstance().call(params)
      },
    })
  }
}
