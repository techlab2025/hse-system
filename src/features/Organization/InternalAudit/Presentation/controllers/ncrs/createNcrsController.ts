import type Params from '@/base/core/params/params'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type InternalAuditNcrModel from '../../../Data/models/ncrs/InternalAuditNcrModel'
import CreateNcrsUseCase from '../../../Domain/useCase/ncrs/createNcrsUseCase'

export default class CreateNcrsController extends ControllerInterface<InternalAuditNcrModel> {
  private static instance: CreateNcrsController
  private readonly useCase = new CreateNcrsUseCase()
  private constructor() { super() }
  static getInstance() { return (this.instance ??= new CreateNcrsController()) }

  async create(params: Params) {
    this.setLoading()
    this.setState(await this.useCase.call(params))
    return this.state
  }
}
