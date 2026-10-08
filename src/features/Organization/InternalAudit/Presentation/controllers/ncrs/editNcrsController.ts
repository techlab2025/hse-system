import type Params from '@/base/core/params/params'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type InternalAuditNcrModel from '../../../Data/models/ncrs/InternalAuditNcrModel'
import EditNcrsUseCase from '../../../Domain/useCase/ncrs/editNcrsUseCase'

export default class EditNcrsController extends ControllerInterface<InternalAuditNcrModel> {
  private static instance: EditNcrsController
  private readonly useCase = new EditNcrsUseCase()
  private constructor() { super() }
  static getInstance() { return (this.instance ??= new EditNcrsController()) }

  async edit(params: Params) {
    this.setLoading()
    this.setState(await this.useCase.call(params))
    return this.state
  }
}
