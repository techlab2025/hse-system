import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type InternalAuditPlanModel from '../../../Data/models/plan/InternalAuditPlanModel'
import IndexInternalAuditPlanUseCase from '../../../Domain/useCase/plan/indexInternalAuditPlanUseCase'

export default class IndexInternalAuditPlanController extends SelectControllerInterface<InternalAuditPlanModel[]> {
  private static instance: IndexInternalAuditPlanController
  private useCase = new IndexInternalAuditPlanUseCase()
  private constructor() { super() }
  static getInstance() { return (this.instance ??= new IndexInternalAuditPlanController()) }
  async getData(params: Params) {
    this.setLoading()
    const state: DataState<InternalAuditPlanModel[]> = await this.useCase.call(params)
    this.setState(state)
    super.handleResponseDialogs()
    return this.state
  }
}
