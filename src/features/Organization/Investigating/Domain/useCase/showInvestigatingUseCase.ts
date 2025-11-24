import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ShowInvestigatingRepo } from '../repositories/showInvestigatingRepo'
import type InvestigatingDetailsModel from '../../Data/models/investigatingDetailsModel'

export default class ShowInvestigatingUseCase implements UseCase<InvestigatingDetailsModel, Params> {
  async call(params: Params): Promise<DataState<InvestigatingDetailsModel>> {
    return ShowInvestigatingRepo.getInstance().call(params)
  }
}
