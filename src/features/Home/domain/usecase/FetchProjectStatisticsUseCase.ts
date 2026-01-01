import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import { DataSuccess, type DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import ProjectStatisticsModel from '../../data/Model/ProjectStatisticsModel'
import { FetchProjectStatisticsRepo } from '../repositories/FetchProjectStatisticsRepo'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'

export default class FetchProjectStatisticsUseCase
  implements UseCase<ProjectStatisticsModel, Params>
{
  async call(params: Params): Promise<DataState<ProjectStatisticsModel>> {
    return UseCaseHandler.instance().handle({
      onTest: () => {
        return new DataSuccess({ data: ProjectStatisticsModel.example })
      },
      onDev: () => {
        return FetchProjectStatisticsRepo.getInstance().call(params)
      },
      onProduction: () => {
        return FetchProjectStatisticsRepo.getInstance().call(params)
      },
    })

  }
}
