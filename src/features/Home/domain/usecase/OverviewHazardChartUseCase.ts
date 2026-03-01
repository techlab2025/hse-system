import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import { DataSuccess, type DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import OverviewHazardChartModel from '../../data/Model/OverviewHazardChartModel'
import { OverviewHazardChartRepo } from '../repositories/OverviewHazardChartRepo'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'

export default class OverviewHazardChartUseCase
  implements UseCase<OverviewHazardChartModel[], Params>
{
  async call(params: Params): Promise<DataState<OverviewHazardChartModel[]>> {
    return UseCaseHandler.instance().handle({

      onTest: () => {
        return new DataSuccess({ data: [OverviewHazardChartModel.example()] })
      },
      onDev: () => {
        return OverviewHazardChartRepo.getInstance().call(params)
      },
      onProduction: () => {
        return OverviewHazardChartRepo.getInstance().call(params)
      },
    })

  }
}
