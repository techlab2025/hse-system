import type UseCase from '@/base/Domain/UseCase/use_case'
import { DataSuccess, type DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import InvestegationResultDetailsModel from '../../../Data/models/investigationResult/InvestegationResulDetailsModel'
import { ShowInvestigatingResultRepo } from '../../repositories/investegationResult/ShowInvestigatingResultRepo'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'

export default class ShowInvestigatingResultUseCase
  implements UseCase<InvestegationResultDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<InvestegationResultDetailsModel>> {
    return UseCaseHandler.instance().handle({
      onTest: () => {
        return new DataSuccess({ data: InvestegationResultDetailsModel.example })
      },
      onDev: () => {
        return ShowInvestigatingResultRepo.getInstance().call(params)
      },
      onProduction: () => {
        return ShowInvestigatingResultRepo.getInstance().call(params)
      },
    })

  }
}
