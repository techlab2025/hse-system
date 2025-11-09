import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ProjectCustomLocationModel from '../../Data/models/CustomLocation/ProjectCustomLocationModel'
import { ProjectCustomLocationRepo } from '../repositories/ProjectCustomLocationRepo'

export default class ProjectCustomLocationUseCase
  implements UseCase<ProjectCustomLocationModel[], Params>
{
  async call(params: Params): Promise<DataState<ProjectCustomLocationModel[]>> {
    return ProjectCustomLocationRepo.getInstance().call(params)
  }
}
