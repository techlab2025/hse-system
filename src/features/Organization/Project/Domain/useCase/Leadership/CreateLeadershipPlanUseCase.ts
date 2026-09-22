import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type LeadershipVisitModel from '../../../Data/models/Leadership/LeadershipVisitModel'
import CreateLeadershipPlanRepo from '../../repositories/Leadership/CreateLeadershipPlanRepo'

export default class CreateLeadershipPlanUseCase implements UseCase<LeadershipVisitModel, Params> {
  call(params: Params): Promise<DataState<LeadershipVisitModel>> {
    return CreateLeadershipPlanRepo.getInstance().call(params)
  }
}
