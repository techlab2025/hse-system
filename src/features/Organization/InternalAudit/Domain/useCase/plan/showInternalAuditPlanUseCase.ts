import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'
import { DataSuccess, type DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import InternalAuditPlanModel from '../../../Data/models/plan/InternalAuditPlanModel'
import { ShowInternalAuditPlanRepo } from '../../repositories/plan/showInternalAuditPlanRepo'

export default class ShowInternalAuditPlanUseCase implements UseCase<InternalAuditPlanModel, Params> {
  async call(params: Params): Promise<DataState<InternalAuditPlanModel>> {
    return UseCaseHandler.instance().handle({
      onTest: () => new DataSuccess({ data: InternalAuditPlanModel.example }),
      onDev: () => ShowInternalAuditPlanRepo.getInstance().call(params),
      onProduction: () => ShowInternalAuditPlanRepo.getInstance().call(params),
    })
  }
}
