import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ShowTeamRepo } from '../repositories/showTeamRepo'
import type TeamDetailsModel from '../../Data/models/TeamDetailsModel'

export default class ShowTeamUseCase implements UseCase<TeamDetailsModel, Params> {
  async call(params: Params): Promise<DataState<TeamDetailsModel>> {
    return ShowTeamRepo.getInstance().call(params)
  }
}
