import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type RoleDetailsModel from '../../Data/models/RoleDetailsModel'
import { ShowRoleRepo } from '../repositories/showRoleRepo'


export default class ShowRoleUseCase
  implements UseCase<RoleDetailsModel, Params> {
  async call(params: Params): Promise<DataState<RoleDetailsModel>> {
    return ShowRoleRepo.getInstance().call(params)
  }
}
