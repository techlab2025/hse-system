import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import {
  DataSuccess,
  type DataState,
} from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ShowWhereHouseRepo } from '../repositories/showWhereHouseRepo'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'
import WhereHouseDetailsModel from '../../Data/models/WhereHouseDetailsModel'

export default class ShowWhereHouseUseCase
  implements UseCase<WhereHouseDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<WhereHouseDetailsModel>> {
    return UseCaseHandler.instance().handle({
      onTest: () => {
        return new DataSuccess({ data: WhereHouseDetailsModel.example })
      },
      onDev: () => {
        return ShowWhereHouseRepo.getInstance().call(params)
      },
      onProduction: () => {
        return ShowWhereHouseRepo.getInstance().call(params)
      },
    })
  }
}
