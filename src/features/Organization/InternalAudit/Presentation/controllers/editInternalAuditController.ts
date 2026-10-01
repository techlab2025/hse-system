import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type InternalAuditModel from '../../Data/models/InternalAuditModel'
import type EditInternalAuditParams from '../../Core/params/editInternalAuditParams'
import EditInternalAuditUseCase from '../../Domain/useCase/editInternalAuditUseCase'

export default class EditInternalAuditController extends ControllerInterface<InternalAuditModel> {
  private static instance: EditInternalAuditController
  private useCase = new EditInternalAuditUseCase()
  private constructor() { super() }
  static getInstance() { return (this.instance ??= new EditInternalAuditController()) }
  async editInternalAudit(params: EditInternalAuditParams) {
    this.setLoading()
    this.setState(await this.useCase.call(params))
    super.handleResponseDialogs()
    return this.state
  }
}
