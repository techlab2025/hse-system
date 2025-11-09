import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { IndexTeamRepo } from '../repositories/indexTeamRepo'
import type TeamModel from '../../Data/models/TeamModel'

export default class IndexTeamUseCase implements UseCase<TeamModel[], Params> {
  async call(params: Params): Promise<DataState<TeamModel[]>> {
    return IndexTeamRepo.getInstance().call(params)
  }
}
