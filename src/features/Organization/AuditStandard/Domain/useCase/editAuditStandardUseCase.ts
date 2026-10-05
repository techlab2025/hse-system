import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'
import {
  DataSuccess,
  type DataState,
} from '@/base/core/networkStructure/Resources/dataState/data_state'
import { EditAuditStandardRepo } from '../repositories/editAuditStandardRepo'
import AuditStandardModel from '../../Data/models/AuditStandardModel'

export default class EditAuditStandardUseCase implements UseCase<AuditStandardModel, Params> {
  async call(params: Params): Promise<DataState<AuditStandardModel>> {
    return UseCaseHandler.instance().handle({
      onTest: () => new DataSuccess({ data: AuditStandardModel.example[0]! }),
      onDev: () => EditAuditStandardRepo.getInstance().call(params),
      onProduction: () => EditAuditStandardRepo.getInstance().call(params),
    })
  }
}
