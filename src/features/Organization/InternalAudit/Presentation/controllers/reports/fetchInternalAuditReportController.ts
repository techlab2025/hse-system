import type Params from '@/base/core/params/params'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type InternalAuditReportModel from '../../../Data/models/reports/InternalAuditReportModel'
import FetchInternalAuditReportUseCase from '../../../Domain/useCase/reports/fetchInternalAuditReportUseCase'

export default class FetchInternalAuditReportController extends ControllerInterface<InternalAuditReportModel> {
  private static instance: FetchInternalAuditReportController
  private readonly useCase = new FetchInternalAuditReportUseCase()
  private constructor() { super() }
  static getInstance() { return (this.instance ??= new FetchInternalAuditReportController()) }

  async fetch(params: Params) {
    this.setLoading()
    this.setState(await this.useCase.call(params))
    return this.state
  }
}
