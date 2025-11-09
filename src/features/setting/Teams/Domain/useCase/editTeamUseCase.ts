import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { EditTeamRepo } from '../repositories/editTeamRepo'
import type TeamModel from '../../Data/models/TeamModel'

export default class EditTeamUseCase implements UseCase<TeamModel, Params> {
  async call(params: Params): Promise<DataState<TeamModel>> {
    return EditTeamRepo.getInstance().call(params)
  }
}
