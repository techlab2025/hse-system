import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'
import {
  DataSuccess,
  type DataState,
} from '@/base/core/networkStructure/Resources/dataState/data_state'
import AuditActivityModel from '../../Data/models/AuditActivityModel'
import { AddAuditActivityCloneRepo } from '../repositories/AddAuditActivityCloneRepo'

export default class AddAuditActivityCloneUseCase implements UseCase<AuditActivityModel, Params> {
  async call(params: Params): Promise<DataState<AuditActivityModel>> {
    return UseCaseHandler.instance().handle({
      onTest: () => new DataSuccess({ data: AuditActivityModel.example[0]! }),
      onDev: () => AddAuditActivityCloneRepo.getInstance().call(params),
      onProduction: () => AddAuditActivityCloneRepo.getInstance().call(params),
    })
  }
}
