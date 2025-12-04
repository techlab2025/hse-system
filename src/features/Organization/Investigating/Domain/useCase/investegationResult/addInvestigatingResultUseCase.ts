import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type InvestigatingModel from '../../../Data/models/investigatingModel'
import type Params from '@/base/core/params/params'
import { AddInvestigatingResultRepo } from '../../repositories/investegationResult/addInvestigatingResultRepo'

export default class AddInvestigatingResultUseCase implements UseCase<InvestigatingModel, Params> {
  async call(params: Params): Promise<DataState<InvestigatingModel>> {
    return AddInvestigatingResultRepo.getInstance().call(params)
  }
}
