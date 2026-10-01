import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type Params from '@/base/core/params/params'
import type InternalAuditPlanModel from '../../../Data/models/plan/InternalAuditPlanModel'
import ShowInternalAuditPlanUseCase from '../../../Domain/useCase/plan/showInternalAuditPlanUseCase'

export default class ShowInternalAuditPlanController extends ControllerInterface<InternalAuditPlanModel> {
  private static instance: ShowInternalAuditPlanController
  private useCase = new ShowInternalAuditPlanUseCase()
  private constructor() { super() }
  static getInstance() { return (this.instance ??= new ShowInternalAuditPlanController()) }
  async getData(params: Params) {
    this.setLoading()
    this.setState(await this.useCase.call(params))
    super.handleResponseDialogs()
    return this.state
  }
}
