import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DeleteTeamRepo } from '../repositories/deleteTeamRepo'
import type TeamModel from '../../Data/models/TeamModel'

export default class DeleteTeamUseCase implements UseCase<TeamModel, Params> {
  async call(params: Params): Promise<DataState<TeamModel>> {
    return DeleteTeamRepo.getInstance().call(params)
  }
}
