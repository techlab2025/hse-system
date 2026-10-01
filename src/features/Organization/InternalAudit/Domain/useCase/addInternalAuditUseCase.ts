import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type InternalAuditModel from '../../Data/models/InternalAuditModel'
import { AddInternalAuditRepo } from '../repositories/addInternalAuditRepo'

export default class AddInternalAuditUseCase implements UseCase<InternalAuditModel, Params> {
  call(params: Params): Promise<DataState<InternalAuditModel>> { return AddInternalAuditRepo.getInstance().call(params) }
}
