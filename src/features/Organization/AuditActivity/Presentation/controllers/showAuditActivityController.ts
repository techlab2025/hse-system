import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type AuditActivityDetailsModel from '../../Data/models/AuditActivityDetailsModel'
import ShowAuditActivityUseCase from '../../Domain/useCase/showAuditActivityUseCase'

export default class ShowAuditActivityController extends ControllerInterface<AuditActivityDetailsModel> {
  private static instance: ShowAuditActivityController

  private constructor() {
    super()
  }

  private ShowAuditActivityUseCase = new ShowAuditActivityUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowAuditActivityController()
    }
    return this.instance
  }

  async showAuditActivity(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<AuditActivityDetailsModel> =
      await this.ShowAuditActivityUseCase.call(params)

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
