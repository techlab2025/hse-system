import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type InternalAuditPlanModel from '../../../Data/models/plan/InternalAuditPlanModel'
import type EditInternalAuditPlanParams from '../../../Core/params/plan/editInternalAuditPlanParams'
import EditInternalAuditPlanUseCase from '../../../Domain/useCase/plan/editInternalAuditPlanUseCase'

export default class EditInternalAuditPlanController extends ControllerInterface<InternalAuditPlanModel> {
  private static instance: EditInternalAuditPlanController
  private useCase = new EditInternalAuditPlanUseCase()
  private constructor() { super() }
  static getInstance() { return (this.instance ??= new EditInternalAuditPlanController()) }
  async editInternalAuditPlan(params: EditInternalAuditPlanParams) {
    this.setLoading()
    this.setState(await this.useCase.call(params))
    super.handleResponseDialogs()
    return this.state
  }
}
