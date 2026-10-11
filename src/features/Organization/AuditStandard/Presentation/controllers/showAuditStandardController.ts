import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type AuditStandardDetailsModel from '../../Data/models/AuditStandardDetailsModel'
import ShowAuditStandardUseCase from '../../Domain/useCase/showAuditStandardUseCase'

export default class ShowAuditStandardController extends ControllerInterface<AuditStandardDetailsModel> {
  private static instance: ShowAuditStandardController

  private constructor() {
    super()
  }

  private ShowAuditStandardUseCase = new ShowAuditStandardUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowAuditStandardController()
    }
    return this.instance
  }

  async showAuditStandard(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<AuditStandardDetailsModel> =
      await this.ShowAuditStandardUseCase.call(params)

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
