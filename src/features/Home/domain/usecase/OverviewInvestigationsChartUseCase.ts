import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import { DataSuccess, type DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import OverviewInvestigationsChartModel from '../../data/Model/OverviewInvestigationsChartModel'
import { OverviewInvestigationsChartRepo } from '../repositories/OverviewInvestigationsChartRepo'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'

export default class OverviewInvestigationsChartUseCase
  implements UseCase<OverviewInvestigationsChartModel[], Params>
{
  async call(params: Params): Promise<DataState<OverviewInvestigationsChartModel[]>> {
    return UseCaseHandler.instance().handle({

      onTest: () => {

        return new DataSuccess({ data: [OverviewInvestigationsChartModel.example()] })
      },
      onDev: () => {
        return OverviewInvestigationsChartRepo.getInstance().call(params)
      },
      onProduction: () => {
        return OverviewInvestigationsChartRepo.getInstance().call(params)
      },
    })

  }
}
