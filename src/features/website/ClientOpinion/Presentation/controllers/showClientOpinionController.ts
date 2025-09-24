import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type ClientOpinionDetailsModel from '../../Data/models/ClientOpinionDetailsModel'
import ShowClientOpinionUseCase from '../../Domain/useCase/showClientOpinionUseCase'

export default class ShowClientOpinionController extends ControllerInterface<ClientOpinionDetailsModel> {
  private static instance: ShowClientOpinionController

  private constructor() {
    super()
  }

  private ShowClientOpinionUseCase = new ShowClientOpinionUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowClientOpinionController()
    }
    return this.instance
  }

  async showClientOpinion(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<ClientOpinionDetailsModel> = await this.ShowClientOpinionUseCase.call(params)

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
