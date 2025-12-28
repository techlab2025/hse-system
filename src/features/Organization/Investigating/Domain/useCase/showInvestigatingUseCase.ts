import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import {
  DataSuccess,
  type DataState,
} from '@/base/core/networkStructure/Resources/dataState/data_state'
import InvestigatingDetailsModel from '../../Data/models/investigatingDetailsModel'
import { ShowInvestigatingRepo } from '../repositories/showInvestigatingRepo'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'

export default class ShowInvestigatingUseCase
  implements UseCase<InvestigatingDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<InvestigatingDetailsModel>> {
    return UseCaseHandler.instance().handle({
      onTest: () => {
        return new DataSuccess({ data: InvestigatingDetailsModel.example })
      },
      onDev: () => {
        return ShowInvestigatingRepo.getInstance().call(params)
      },
      onProduction: () => {
        return ShowInvestigatingRepo.getInstance().call(params)
      },
    })
  }
}
