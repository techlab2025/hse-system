import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DeleteRoleRepo } from '../repositories/deleteRoleRepo'
import type RoleModel from '../../Data/models/RoleModel'

export default class DeleteRoleUseCase implements UseCase<RoleModel, Params> {
  async call(params: Params): Promise<DataState<RoleModel>> {
    return DeleteRoleRepo.getInstance().call(params)
  }
}
