import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type PermissionModel from '../../Data/models/PermissionModel'
import { DeletePermissionRepo } from '../repositories/deletePermissionRepo'




export default class DeletePermissionUseCase implements UseCase<PermissionModel, Params> {
  async call(params: Params): Promise<DataState<PermissionModel>> {
    return DeletePermissionRepo.getInstance().call(params)
  }
}
