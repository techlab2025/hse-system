import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type LeadershipVisitDetailsModel from '../../../Data/models/Leadership/LeadershipVisitDetailsModel'
import FetchLeadershipVisitDetailsRepo from '../../repositories/Leadership/FetchLeadershipVisitDetailsRepo'

export default class FetchLeadershipVisitDetailsUseCase
  implements UseCase<LeadershipVisitDetailsModel, Params>
{
  call(params: Params): Promise<DataState<LeadershipVisitDetailsModel>> {
    return FetchLeadershipVisitDetailsRepo.getInstance().call(params)
  }
}
