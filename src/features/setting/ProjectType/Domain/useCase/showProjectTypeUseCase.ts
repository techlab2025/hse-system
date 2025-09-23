import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ShowProjectTypeRepo } from '@/features/setting/ProjectType/Domain/repositories/showProjectTypeRepo'
import ProjectTypeDetailsModel from '@/features/setting/ProjectType/Data/models/projectTypeDetailsModel.ts'

export default class ShowProjectTypeUseCase
  implements UseCase<ProjectTypeDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<ProjectTypeDetailsModel>> {
    return ShowProjectTypeRepo.getInstance().call(params)
  }
}
