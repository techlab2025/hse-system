import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type PermissionModel from '../../Data/models/PermissionModel'
import { AddPermissionRepo } from '../repositories/addPermissionRepo'

export default class AddPermissionteUseCase implements UseCase<PermissionModel, Params> {
  async call(params: Params): Promise<DataState<PermissionModel>> {
    return AddPermissionRepo.getInstance().call(params)
  }
}
