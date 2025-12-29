import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { AddInvestigatingResultRepo } from '../../repositories/investegationResult/addInvestigatingResultRepo'
import type InvestegationResultModel from '../../../Data/models/investigationResult/InvestegationResulModel'

export default class AddInvestigatingResultUseCase implements UseCase<InvestegationResultModel, Params> {
  async call(params: Params): Promise<DataState<InvestegationResultModel>> {
    return AddInvestigatingResultRepo.getInstance().call(params)
  }
}
