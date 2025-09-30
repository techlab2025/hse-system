import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ProjectDetailsModel from '../../Data/models/ProjectDetailsModel'
import { ShowProjectRepo } from '../repositories/showProjectRepo'


export default class ShowProjectUseCase
  implements UseCase<ProjectDetailsModel, Params> {
  async call(params: Params): Promise<DataState<ProjectDetailsModel>> {
    return ShowProjectRepo.getInstance().call(params)
  }
}
