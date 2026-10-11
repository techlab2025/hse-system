import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'
import {
  DataSuccess,
  type DataState,
} from '@/base/core/networkStructure/Resources/dataState/data_state'
import { AddAuditStandardRepo } from '../repositories/addAuditStandardRepo'
import AuditStandardModel from '../../Data/models/AuditStandardModel'

export default class AddAuditStandardUseCase implements UseCase<AuditStandardModel, Params> {
  async call(params: Params): Promise<DataState<AuditStandardModel>> {
    return UseCaseHandler.instance().handle({
      onTest: () => new DataSuccess({ data: AuditStandardModel.example[0]! }),
      onDev: () => AddAuditStandardRepo.getInstance().call(params),
      onProduction: () => AddAuditStandardRepo.getInstance().call(params),
    })
  }
}
