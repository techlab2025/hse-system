import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type InternalAuditPlanModel from '../../../Data/models/plan/InternalAuditPlanModel'
import type DeleteInternalAuditPlanParams from '../../../Core/params/plan/deleteInternalAuditPlanParams'
import DeleteInternalAuditPlanUseCase from '../../../Domain/useCase/plan/deleteInternalAuditPlanUseCase'

export default class DeleteInternalAuditPlanController extends ControllerInterface<InternalAuditPlanModel> {
  private static instance: DeleteInternalAuditPlanController
  private useCase = new DeleteInternalAuditPlanUseCase()
  private constructor() { super() }
  static getInstance() { return (this.instance ??= new DeleteInternalAuditPlanController()) }
  async deleteInternalAuditPlan(params: DeleteInternalAuditPlanParams) {
    this.setLoading()
    this.setState(await this.useCase.call(params))
    super.handleResponseDialogs()
    return this.state
  }
}
