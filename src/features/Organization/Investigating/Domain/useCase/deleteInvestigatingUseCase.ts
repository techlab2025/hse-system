import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DeleteInvestigatingRepo } from '../repositories/deleteInvestigatingRepo'
import type InvestigatingModel from '../../Data/models/investigatingModel'

export default class DeleteInvestigatingUseCase implements UseCase<InvestigatingModel, Params> {
  async call(params: Params): Promise<DataState<InvestigatingModel>> {
    return DeleteInvestigatingRepo.getInstance().call(params)
  }
}
