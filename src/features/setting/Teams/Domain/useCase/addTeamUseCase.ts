import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { AddTeamRepo } from '../repositories/addTeamRepo'
import type TeamModel from '../../Data/models/TeamModel'

export default class AddTeamUseCase implements UseCase<TeamModel, Params> {
  async call(params: Params): Promise<DataState<TeamModel>> {
    return AddTeamRepo.getInstance().call(params)
  }
}
