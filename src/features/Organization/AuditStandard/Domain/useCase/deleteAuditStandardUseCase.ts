import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'
import {
  DataSuccess,
  type DataState,
} from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DeleteAuditStandardRepo } from '../repositories/deleteAuditStandardRepo'
import AuditStandardModel from '../../Data/models/AuditStandardModel'

export default class DeleteAuditStandardUseCase implements UseCase<AuditStandardModel, Params> {
  async call(params: Params): Promise<DataState<AuditStandardModel>> {
    return UseCaseHandler.instance().handle({
      onTest: () => new DataSuccess({ data: AuditStandardModel.example[0]! }),
      onDev: () => DeleteAuditStandardRepo.getInstance().call(params),
      onProduction: () => DeleteAuditStandardRepo.getInstance().call(params),
    })
  }
}
