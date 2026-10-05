// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type AuditActivityModel from '../../Data/models/AuditActivityModel'
import IndexAuditActivityUseCase from '../../Domain/useCase/indexAuditActivityUseCase'

export default class IndexAuditActivityController extends SelectControllerInterface<
  AuditActivityModel[]
> {
  private static instance: IndexAuditActivityController
  private constructor() {
    super()
  }
  private IndexAuditActivityUseCase = new IndexAuditActivityUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexAuditActivityController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<AuditActivityModel[]> =
      await this.IndexAuditActivityUseCase.call(params)

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
