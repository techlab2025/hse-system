import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type PermissionDetailsModel from '../../Data/models/PermissionDetailsModel'
import { ShowPermissionRepo } from '../repositories/showPermissionRepo'


export default class ShowPermissionUseCase
  implements UseCase<PermissionDetailsModel, Params> {
  async call(params: Params): Promise<DataState<PermissionDetailsModel>> {
    return ShowPermissionRepo.getInstance().call(params)
  }
}
