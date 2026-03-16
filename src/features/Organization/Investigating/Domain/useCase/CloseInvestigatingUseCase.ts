import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type InvestigatingModel from '../../Data/models/investigatingModel'
import { CloseInvestigatingRepo } from '../repositories/CloseInvestigatingRepo'

export default class CloseInvestigatingUseCase implements UseCase<InvestigatingModel, Params> {
  async call(params: Params): Promise<DataState<InvestigatingModel>> {
    return CloseInvestigatingRepo.getInstance().call(params)
  }
}
