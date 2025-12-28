import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import {
  DataSuccess,
  type DataState,
} from '@/base/core/networkStructure/Resources/dataState/data_state'
import { IndexInvestigatingRepo } from '../repositories/indexInvestigatingRepo'
import InvestigatingModel from '../../Data/models/investigatingModel'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'

export default class IndexInvestigatingUseCase implements UseCase<InvestigatingModel[], Params> {
  async call(params: Params): Promise<DataState<InvestigatingModel[]>> {
    return UseCaseHandler.instance().handle({
      onTest: () => {
        return new DataSuccess({ data: InvestigatingModel.example })
      },
      onDev: () => {
        return IndexInvestigatingRepo.getInstance().call(params)
      },
      onProduction: () => {
        return IndexInvestigatingRepo.getInstance().call(params)
      },
    })
  }
}
