import { DataSuccess, type DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'
import InternalAuditPlanReportDetailsModel from '../../../Data/models/reports/InternalAuditPlanReportDetailsModel'
import FetchInternalAuditPlanDetailsRepo from '../../repositories/reports/fetchInternalAuditPlanDetailsRepo'

export default class FetchInternalAuditPlanDetailsUseCase implements UseCase<InternalAuditPlanReportDetailsModel, Params> {
  async call(params: Params): Promise<DataState<InternalAuditPlanReportDetailsModel>> {
    return UseCaseHandler.instance().handle({
      onTest: () => new DataSuccess({ data: InternalAuditPlanReportDetailsModel.example }),
      onDev: () => FetchInternalAuditPlanDetailsRepo.getInstance().call(params),
      onProduction: () => FetchInternalAuditPlanDetailsRepo.getInstance().call(params),
    })
  }
}
