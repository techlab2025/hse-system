import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type InvestegationResultDetailsModel from '../../../Data/models/investigationResult/InvestegationResulDetailsModel'
import { ShowInvestigatingResultRepo } from '../../repositories/investegationResult/ShowInvestigatingResultRepo'

export default class ShowInvestigatingResultUseCase
  implements UseCase<InvestegationResultDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<InvestegationResultDetailsModel>> {
    return ShowInvestigatingResultRepo.getInstance().call(params)
  }
}
