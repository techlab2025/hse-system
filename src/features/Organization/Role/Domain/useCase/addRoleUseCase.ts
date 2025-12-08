import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { AddRoleRepo } from '../repositories/addRoleRepo'
import type RoleModel from '../../Data/models/RoleModel'

export default class AddRoleteUseCase implements UseCase<RoleModel, Params> {
  async call(params: Params): Promise<DataState<RoleModel>> {
    return AddRoleRepo.getInstance().call(params)
  }
}
