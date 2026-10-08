import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type InternalAuditNcrModel from '../../../Data/models/ncrs/InternalAuditNcrModel'
import FetchMyNcrsUseCase from '../../../Domain/useCase/my/fetchMyNcrsUseCase'

export default class FetchMyNcrsController extends SelectControllerInterface<
  InternalAuditNcrModel[]
> {
  private static instance: FetchMyNcrsController
  private readonly useCase = new FetchMyNcrsUseCase()
  private requestId = 0
  private constructor() {
    super([])
  }
  static getInstance() {
    return (this.instance ??= new FetchMyNcrsController())
  }

  async getData(params: Params) {
    const requestId = ++this.requestId
    this.setLoading()
    const state = await this.useCase.call(params)
    if (requestId === this.requestId) this.setState(state)
    return this.state
  }
}
