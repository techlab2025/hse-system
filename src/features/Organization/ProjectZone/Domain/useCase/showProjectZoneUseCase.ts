import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ProjectZoneDetailsModel from '../../Data/models/ProjectZoneDetailsModel'
import { ShowProjectZoneRepo } from '../repositories/showProjectZoneRepo'



export default class ShowProjectZoneUseCase
  implements UseCase<ProjectZoneDetailsModel, Params> {
  async call(params: Params): Promise<DataState<ProjectZoneDetailsModel>> {
    return ShowProjectZoneRepo.getInstance().call(params)
  }
}
