import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type InternalAuditPlanModel from '../../../Data/models/plan/InternalAuditPlanModel'
import { IndexInternalAuditPlanRepo } from '../../repositories/plan/indexInternalAuditPlanRepo'

export default class IndexInternalAuditPlanUseCase implements UseCase<InternalAuditPlanModel[], Params> {
  call(params: Params): Promise<DataState<InternalAuditPlanModel[]>> { return IndexInternalAuditPlanRepo.getInstance().call(params) }
}
