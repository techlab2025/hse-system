import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type InternalAuditNcrModel from '../../../Data/models/ncrs/InternalAuditNcrModel'
import FetchNcrsUseCase from '../../../Domain/useCase/ncrs/fetchNcrsUseCase'

export default class FetchNcrsController extends SelectControllerInterface<InternalAuditNcrModel[]> {
  private static instance: FetchNcrsController
  private readonly useCase = new FetchNcrsUseCase()
  private constructor() { super([]) }
  static getInstance() { return (this.instance ??= new FetchNcrsController()) }

  async getData(params: Params) {
    this.setLoading()
    this.setState(await this.useCase.call(params))
    return this.state
  }
}
