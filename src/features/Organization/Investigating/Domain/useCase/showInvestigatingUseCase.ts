import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import {
  DataSuccess,
  type DataState,
} from '@/base/core/networkStructure/Resources/dataState/data_state'
import InvestigatingDetailsModel from '../../Data/models/investigatingDetailsModel'
import { ShowInvestigatingRepo } from '../repositories/showInvestigatingRepo'

export default class ShowInvestigatingUseCase
  implements UseCase<InvestigatingDetailsModel, Params>
{
  public isExample: boolean = true

  async call(params: Params): Promise<DataState<InvestigatingDetailsModel>> {
    return this.isExample
      ? new DataSuccess({ data: InvestigatingDetailsModel.example })
      : ShowInvestigatingRepo.getInstance().call(params)
  }
}
