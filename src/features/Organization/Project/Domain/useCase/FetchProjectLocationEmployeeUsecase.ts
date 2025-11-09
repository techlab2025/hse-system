import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ProjectLocationEmployeesModel from '../../Data/models/ProjectLocationEmployee'
import { FetchProjectLocationEmployeeRepo } from '../repositories/FetchProjectLocationEmployeeRepo'

export default class FetchProjectLocationEmployeeUseCase
  implements UseCase<ProjectLocationEmployeesModel[], Params>
{
  async call(params: Params): Promise<DataState<ProjectLocationEmployeesModel[]>> {
    return FetchProjectLocationEmployeeRepo.getInstance().call(params)
  }
}
