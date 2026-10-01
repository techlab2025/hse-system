import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type Params from '@/base/core/params/params'
import type InternalAuditModel from '../../Data/models/InternalAuditModel'
import ShowInternalAuditUseCase from '../../Domain/useCase/showInternalAuditUseCase'

export default class ShowInternalAuditController extends ControllerInterface<InternalAuditModel> {
  private static instance: ShowInternalAuditController
  private useCase = new ShowInternalAuditUseCase()
  private constructor() { super() }
  static getInstance() { return (this.instance ??= new ShowInternalAuditController()) }
  async getData(params: Params) {
    this.setLoading()
    this.setState(await this.useCase.call(params))
    super.handleResponseDialogs()
    return this.state
  }
}
