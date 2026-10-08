import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'
import {
  DataSuccess,
  type DataState,
} from '@/base/core/networkStructure/Resources/dataState/data_state'
import ShowProjectSummaryDetailsModel from '../../Data/models/ShowProjectSummaryDetailsModel'
import { ShowProjectSummaryDetailsRepo } from '../repositories/ShowProjectSummaryDetailsRepo'

export default class ShowProjectSummaryDetailsUseCase
  implements UseCase<ShowProjectSummaryDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<ShowProjectSummaryDetailsModel>> {
    return UseCaseHandler.instance().handle({
      onTest: () => {
        return new DataSuccess({ data: ShowProjectSummaryDetailsModel.example })
      },
      onDev: () => {
        return ShowProjectSummaryDetailsRepo.getInstance().call(params)
      },
      onProduction: () => {
        return ShowProjectSummaryDetailsRepo.getInstance().call(params)
      },
    })
  }
}
