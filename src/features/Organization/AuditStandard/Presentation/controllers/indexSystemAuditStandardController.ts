// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type AuditStandardModel from '../../Data/models/AuditStandardModel'
import IndexAuditStandardUseCase from '../../Domain/useCase/indexAuditStandardUseCase'

export default class IndexSystemAuditStandardController extends SelectControllerInterface<
  AuditStandardModel[]
> {
  private static instance: IndexSystemAuditStandardController
  private constructor() {
    super()
  }
  private IndexAuditStandardUseCase = new IndexAuditStandardUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexSystemAuditStandardController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<AuditStandardModel[]> =
      await this.IndexAuditStandardUseCase.call(params)

    this.setState(dataState)
    if (this.isDataSuccess()) {
      // useLoaderStore().endLoadingWithDialog();
    } else {
      throw new Error('Error while addServices')
    }
    super.handleResponseDialogs()
    return this.state
  }
}
