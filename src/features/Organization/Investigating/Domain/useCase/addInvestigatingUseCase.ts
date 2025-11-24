import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { AddInvestigatingRepo } from '../repositories/addInvestigatingRepo'
import type InvestigatingModel from '../../Data/models/investigatingModel'
import type Params from '@/base/core/params/params'

export default class AddInvestigatingUseCase implements UseCase<InvestigatingModel, Params> {
  async call(params: Params): Promise<DataState<InvestigatingModel>> {
    return AddInvestigatingRepo.getInstance().call(params)
  }
}
