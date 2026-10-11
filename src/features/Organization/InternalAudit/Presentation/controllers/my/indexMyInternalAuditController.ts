import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type InternalAuditPlanModel from '../../../Data/models/plan/InternalAuditPlanModel'
import IndexMyInternalAuditUseCase from '../../../Domain/useCase/my/indexMyInternalAuditUseCase'

export default class IndexMyInternalAuditController extends SelectControllerInterface<
  InternalAuditPlanModel[]
> {
  private static instance: IndexMyInternalAuditController
  private useCase = new IndexMyInternalAuditUseCase()
  private requestId = 0
  private constructor() {
    super()
  }
  static getInstance() {
    return (this.instance ??= new IndexMyInternalAuditController())
  }
  async getData(params: Params) {
    const requestId = ++this.requestId
    this.setLoading()
    const state: DataState<InternalAuditPlanModel[]> = await this.useCase.call(params)
    if (requestId === this.requestId) this.setState(state)
    super.handleResponseDialogs()
    return this.state
  }
}
