import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type PartnerDetailsModel from '../../Data/models/PartnerDetailsModel'
import ShowPartnerUseCase from '../../Domain/useCase/showPartnerUseCase'

export default class ShowPartnerteController extends ControllerInterface<PartnerDetailsModel> {
  private static instance: ShowPartnerteController

  private constructor() {
    super()
  }

  private ShowPartnerUseCase = new ShowPartnerUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowPartnerteController()
    }
    return this.instance
  }

  async showPartner(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<PartnerDetailsModel> =
      await this.ShowPartnerUseCase.call(params)

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
