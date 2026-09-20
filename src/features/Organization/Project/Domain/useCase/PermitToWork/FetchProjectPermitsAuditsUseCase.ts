import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { FetchPermitsAuditRepo } from '../../repositories/PermitToWork/FetchPermitsAuditRepo'
import type PermitAuditResultModel from '../../../Data/models/PermitToWork/PermitAuditResultModel'

export default class FetchProjectPermitsAuditsUseCase
  implements UseCase<PermitAuditResultModel[], Params>
{
  async call(params: Params): Promise<DataState<PermitAuditResultModel[]>> {
    return FetchPermitsAuditRepo.getInstance().call(params)
  }
}
