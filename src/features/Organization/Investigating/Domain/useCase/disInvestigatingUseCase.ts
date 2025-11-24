import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DisActiveInvestigatingRepo } from '../repositories/disActiveInvestigatingRepo'
import type InvestigatingModel from '../../Data/models/investigatingModel'

export default class DisInvestigatingUseCase implements UseCase<InvestigatingModel, Params> {
  async call(params: Params): Promise<DataState<InvestigatingModel>> {
    return DisActiveInvestigatingRepo.getInstance().call(params)
  }
}
