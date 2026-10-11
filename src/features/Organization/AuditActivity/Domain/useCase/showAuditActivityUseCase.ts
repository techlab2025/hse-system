import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'
import {
  DataSuccess,
  type DataState,
} from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ShowAuditActivityRepo } from '../repositories/showAuditActivityRepo'
import AuditActivityDetailsModel from '../../Data/models/AuditActivityDetailsModel'

export default class ShowAuditActivityUseCase
  implements UseCase<AuditActivityDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<AuditActivityDetailsModel>> {
    return UseCaseHandler.instance().handle({
      onTest: () => new DataSuccess({ data: AuditActivityDetailsModel.example }),
      onDev: () => ShowAuditActivityRepo.getInstance().call(params),
      onProduction: () => ShowAuditActivityRepo.getInstance().call(params),
    })
  }
}
