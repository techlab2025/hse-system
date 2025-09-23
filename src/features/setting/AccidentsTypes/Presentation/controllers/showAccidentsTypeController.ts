import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import ShowAccidentsTypeUseCase from '../../Domain/useCase/showAccidentsTypeUseCase'
import type AccidentsTypeDetailsModel from '../../Data/models/AccidentsTypeDetailsModel'

export default class ShowAccidentsTypeController extends ControllerInterface<AccidentsTypeDetailsModel> {
  private static instance: ShowAccidentsTypeController

  private constructor() {
    super()
  }

  private showAccidentsTypeUseCase = new ShowAccidentsTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowAccidentsTypeController()
    }
    return this.instance
  }

  async showAccidentsType(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<AccidentsTypeDetailsModel> =
      await this.showAccidentsTypeUseCase.call(params)

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
