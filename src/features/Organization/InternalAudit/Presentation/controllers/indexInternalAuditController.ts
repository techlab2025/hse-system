import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type InternalAuditModel from '../../Data/models/InternalAuditModel'
import IndexInternalAuditUseCase from '../../Domain/useCase/indexInternalAuditUseCase'

export default class IndexInternalAuditController extends SelectControllerInterface<InternalAuditModel[]> {
  private static instance: IndexInternalAuditController
  private useCase = new IndexInternalAuditUseCase()
  private constructor() { super() }
  static getInstance() { return (this.instance ??= new IndexInternalAuditController()) }
  async getData(params: Params) {
    this.setLoading()
    const state: DataState<InternalAuditModel[]> = await this.useCase.call(params)
    this.setState(state)
    super.handleResponseDialogs()
    return this.state
  }
}
