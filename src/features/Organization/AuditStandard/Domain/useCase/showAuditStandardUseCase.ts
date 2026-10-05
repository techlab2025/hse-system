import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'
import {
  DataSuccess,
  type DataState,
} from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ShowAuditStandardRepo } from '../repositories/showAuditStandardRepo'
import AuditStandardDetailsModel from '../../Data/models/AuditStandardDetailsModel'

export default class ShowAuditStandardUseCase
  implements UseCase<AuditStandardDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<AuditStandardDetailsModel>> {
    return UseCaseHandler.instance().handle({
      onTest: () => new DataSuccess({ data: AuditStandardDetailsModel.example }),
      onDev: () => ShowAuditStandardRepo.getInstance().call(params),
      onProduction: () => ShowAuditStandardRepo.getInstance().call(params),
    })
  }
}
