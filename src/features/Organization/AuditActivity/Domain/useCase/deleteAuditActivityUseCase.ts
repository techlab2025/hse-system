import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'
import {
  DataSuccess,
  type DataState,
} from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DeleteAuditActivityRepo } from '../repositories/deleteAuditActivityRepo'
import AuditActivityModel from '../../Data/models/AuditActivityModel'

export default class DeleteAuditActivityUseCase implements UseCase<AuditActivityModel, Params> {
  async call(params: Params): Promise<DataState<AuditActivityModel>> {
    return UseCaseHandler.instance().handle({
      onTest: () => new DataSuccess({ data: AuditActivityModel.example[0]! }),
      onDev: () => DeleteAuditActivityRepo.getInstance().call(params),
      onProduction: () => DeleteAuditActivityRepo.getInstance().call(params),
    })
  }
}
