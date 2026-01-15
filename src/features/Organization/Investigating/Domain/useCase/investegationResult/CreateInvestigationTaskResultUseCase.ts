import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type InvestegationResultModel from '../../../Data/models/investigationResult/InvestegationResulModel'
import { CreateInvestigationTaskResultRepo } from '../../repositories/investegationResult/CreateInestigationTaskResultRepo'

export default class CreateInvestigationTaskResultUseCase
  implements UseCase<InvestegationResultModel, Params>
{
  async call(params: Params): Promise<DataState<InvestegationResultModel>> {
    return CreateInvestigationTaskResultRepo.getInstance().call(params)
  }
}
