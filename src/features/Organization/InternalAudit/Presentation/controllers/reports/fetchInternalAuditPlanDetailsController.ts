import type Params from '@/base/core/params/params'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type InternalAuditPlanReportDetailsModel from '../../../Data/models/reports/InternalAuditPlanReportDetailsModel'
import FetchInternalAuditPlanDetailsUseCase from '../../../Domain/useCase/reports/fetchInternalAuditPlanDetailsUseCase'

export default class FetchInternalAuditPlanDetailsController extends ControllerInterface<InternalAuditPlanReportDetailsModel> {
  private static instance: FetchInternalAuditPlanDetailsController
  private readonly useCase = new FetchInternalAuditPlanDetailsUseCase()
  private constructor() { super() }
  static getInstance() { return (this.instance ??= new FetchInternalAuditPlanDetailsController()) }

  async fetch(params: Params) {
    this.setLoading()
    this.setState(await this.useCase.call(params))
    return this.state
  }
}
