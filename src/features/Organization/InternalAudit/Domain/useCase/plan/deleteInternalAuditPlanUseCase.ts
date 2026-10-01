import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type InternalAuditPlanModel from '../../../Data/models/plan/InternalAuditPlanModel'
import { DeleteInternalAuditPlanRepo } from '../../repositories/plan/deleteInternalAuditPlanRepo'

export default class DeleteInternalAuditPlanUseCase implements UseCase<InternalAuditPlanModel, Params> {
  call(params: Params): Promise<DataState<InternalAuditPlanModel>> { return DeleteInternalAuditPlanRepo.getInstance().call(params) }
}
