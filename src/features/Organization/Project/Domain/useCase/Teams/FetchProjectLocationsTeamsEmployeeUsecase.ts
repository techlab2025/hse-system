import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type LocationTeamEmployeesModel from '../../../Data/models/Teams/ProjectLocationTeamEmployee'
import { FetchProjectLocationsTeamEmployeeRepo } from '../../repositories/Teams/FetchProjectLocationsTeamEmployeeRepo'

export default class FetchProjectLocationsTeamsEmployeeUseCase
  implements UseCase<LocationTeamEmployeesModel[], Params>
{
  async call(params: Params): Promise<DataState<LocationTeamEmployeesModel[]>> {
    return FetchProjectLocationsTeamEmployeeRepo.getInstance().call(params)
  }
}
