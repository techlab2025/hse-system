import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type PermissionModel from '../../Data/models/PermissionModel'
import { EditPermissionRepo } from '../repositories/editPermissionRepo'


export default class EditPermissionUseCase implements UseCase<PermissionModel, Params> {
  async call(params: Params): Promise<DataState<PermissionModel>> {
    return EditPermissionRepo.getInstance().call(params)
  }
}
