import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import {
  DataSuccess,
  type DataState,
} from '@/base/core/networkStructure/Resources/dataState/data_state'
import { FetchTaskResultDetailsRepo } from '../repositories/FetchTaskResultDetailsRepo'
import FetchTaskResultDetailsModel from '../../Data/models/FetchTaskResultDetails'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'

export default class FetchTaskResultDetailsUseCase
  implements UseCase<FetchTaskResultDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<FetchTaskResultDetailsModel>> {
    return UseCaseHandler.instance().handle({
      onTest: () => {
        return new DataSuccess({ data: FetchTaskResultDetailsModel.example })
      },
      onDev: () => {
        return FetchTaskResultDetailsRepo.getInstance().call(params)
      },
      onProduction: () => {
        return FetchTaskResultDetailsRepo.getInstance().call(params)
      },
    })
  }
}
