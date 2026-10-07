import { DataSuccess, type DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'
import InternalAuditReportModel from '../../../Data/models/reports/InternalAuditReportModel'
import FetchInternalAuditReportRepo from '../../repositories/reports/fetchInternalAuditReportRepo'

export default class FetchInternalAuditReportUseCase implements UseCase<InternalAuditReportModel, Params> {
  async call(params: Params): Promise<DataState<InternalAuditReportModel>> {
    return UseCaseHandler.instance().handle({
      onTest: () => new DataSuccess({ data: InternalAuditReportModel.example }),
      onDev: () => FetchInternalAuditReportRepo.getInstance().call(params),
      onProduction: () => FetchInternalAuditReportRepo.getInstance().call(params),
    })
  }
}
