import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import { DataSuccess, type DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import FetchHomeInspectionModel from '../../data/Model/FetchHomeInspectionModel'
import { FetchHomeInspectionRepo } from '../repositories/FetchHomeInspectionRepo'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'

export default class FetchHomeInspectionUseCase
  implements UseCase<FetchHomeInspectionModel, Params>
{
  async call(params: Params): Promise<DataState<FetchHomeInspectionModel>> {
    return UseCaseHandler.instance().handle({
      onTest: () => {
        return new DataSuccess({ data: FetchHomeInspectionModel.example })
      },
      onDev: () => {
        return FetchHomeInspectionRepo.getInstance().call(params)
      },
      onProduction: () => {
        return FetchHomeInspectionRepo.getInstance().call(params)
      },
    })

  }
}
