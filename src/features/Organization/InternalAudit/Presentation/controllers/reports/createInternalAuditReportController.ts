import type Params from '@/base/core/params/params'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type InternalAuditPlanReportDetailsModel from '../../../Data/models/reports/InternalAuditPlanReportDetailsModel'
import CreateInternalAuditReportUseCase from '../../../Domain/useCase/reports/createInternalAuditReportUseCase'

export default class CreateInternalAuditReportController extends ControllerInterface<InternalAuditPlanReportDetailsModel> {
  private static instance: CreateInternalAuditReportController
  private readonly useCase = new CreateInternalAuditReportUseCase()
  private constructor() { super() }
  static getInstance() { return (this.instance ??= new CreateInternalAuditReportController()) }

  async create(params: Params) {
    this.setLoading()
    this.setState(await this.useCase.call(params))
    return this.state
  }
}
