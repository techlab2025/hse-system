import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type InternalAuditModel from '../../Data/models/InternalAuditModel'
import type DeleteInternalAuditParams from '../../Core/params/deleteInternalAuditParams'
import DeleteInternalAuditUseCase from '../../Domain/useCase/deleteInternalAuditUseCase'

export default class DeleteInternalAuditController extends ControllerInterface<InternalAuditModel> {
  private static instance: DeleteInternalAuditController
  private useCase = new DeleteInternalAuditUseCase()
  private constructor() { super() }
  static getInstance() { return (this.instance ??= new DeleteInternalAuditController()) }
  async deleteInternalAudit(params: DeleteInternalAuditParams) {
    this.setLoading()
    this.setState(await this.useCase.call(params))
    super.handleResponseDialogs()
    return this.state
  }
}
