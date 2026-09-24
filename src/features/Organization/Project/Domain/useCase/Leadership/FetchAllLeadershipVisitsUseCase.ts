import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import {
  DataSuccess,
  type DataState,
} from '@/base/core/networkStructure/Resources/dataState/data_state'
import LeadershipVisitModel from '../../../Data/models/Leadership/LeadershipVisitModel'
import FetchAllLeadershipVisitsRepo from '../../repositories/Leadership/FetchAllLeadershipVisitsRepo'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'

export default class FetchAllLeadershipVisitsUseCase
  implements UseCase<LeadershipVisitModel[], Params>
{
  call(params: Params): Promise<DataState<LeadershipVisitModel[]>> {
    // return FetchAllLeadershipVisitsRepo.getInstance().call(params)

    return UseCaseHandler.instance().handle({
      onTest: () => {
        return new DataSuccess({
          data: [
            LeadershipVisitModel.example,
            LeadershipVisitModel.example,
            LeadershipVisitModel.example,
          ],
        })
      },
      onDev: () => {
        return FetchAllLeadershipVisitsRepo.getInstance().call(params)
      },
      onProduction: () => {
        return FetchAllLeadershipVisitsRepo.getInstance().call(params)
      },
    })
  }
}
