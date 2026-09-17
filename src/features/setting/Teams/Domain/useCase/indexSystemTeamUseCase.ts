import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type TeamModel from '../../Data/models/TeamModel'
import { IndexSystemTeamRepo } from '../repositories/indexSystemTeamRepo'

export default class IndexSystemTeamUseCase implements UseCase<TeamModel[], Params> {
  async call(params: Params): Promise<DataState<TeamModel[]>> {
    return IndexSystemTeamRepo.getInstance().call(params)
  }
}
